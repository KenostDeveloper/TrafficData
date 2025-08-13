import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style, Text, Circle, Fill, Stroke } from 'ol/style';
import Cluster from 'ol/source/Cluster';
import 'ol/ol.css';
import styles from './Map.module.css';
import type { Project } from '../../types';
import markerIcon from '../../assets/icons/marker.svg';

interface MapComponentProps {
  projects: Project[];
  onMapClick?: (coords: [number, number]) => void;
  selectedPoint: [number, number] | null;
}

export const MapComponent = ({ 
  projects, 
  onMapClick,
  selectedPoint
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const selectionSource = useRef(new VectorSource());
  const clusterSource = useRef(new Cluster({
    source: vectorSource.current,
    distance: 40
  }));

  const markerStyle = new Style({
    image: new Icon({
      src: markerIcon,
      scale: 1,
      anchor: [0.5, 1]
    })
  });

  const selectionStyle = new Style({
    image: new Icon({
      src: markerIcon,
      scale: 1,
      anchor: [0.5, 1],
      color: '#00eeffff'
    })
  });

  const clusterStyle = (size: number) => {
    return new Style({
      image: new Circle({
        radius: 15 + Math.min(size, 10),
        fill: new Fill({ color: '#29303D' }),
        stroke: new Stroke({
          color: '#fff',
          width: 2
        })
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({ color: '#fff' }),
        font: 'bold 12px sans-serif'
      })
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: clusterSource.current,
          style: (feature) => {
            const features = feature.get('features');
            return features.length === 1 
              ? markerStyle 
              : clusterStyle(features.length);
          }
        }),
        new VectorLayer({
          source: selectionSource.current
        })
      ],
      view: new View({
        center: fromLonLat([56.227431, 58.008653]),
        zoom: 12
      })
    });

    const clickHandler = (e: any) => {
      if (onMapClick) {
        const coords = toLonLat(e.coordinate);
        onMapClick([coords[0], coords[1]]);
      }
    };

    map.on('click', clickHandler);

    mapInstance.current = map;

    return () => {
      map.un('click', clickHandler);
      map.setTarget(undefined);
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    vectorSource.current.clear();

    projects.forEach(project => {
      try {
        const marker = new Feature({
          geometry: new Point(fromLonLat(project.coordinates)),
          name: project.name
        });
        vectorSource.current.addFeature(marker);
      } catch (e) {
        console.error('Error creating marker:', e);
      }
    });

    if (projects.length > 0 && mapInstance.current) {
      setTimeout(() => {
        const extent = vectorSource.current.getExtent();
        if (!isNaN(extent[0])) {
          mapInstance.current?.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15
          });
        }
      }, 100);
    }
  }, [projects]);

  useEffect(() => {
    selectionSource.current.clear();
    
    if (selectedPoint) {
      const marker = new Feature({
        geometry: new Point(fromLonLat(selectedPoint))
      });
      marker.setStyle(selectionStyle);
      selectionSource.current.addFeature(marker);
    }
  }, [selectedPoint]);

  return <div ref={mapRef} className={styles.map} />;
};