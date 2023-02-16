import React,{useEffect, useRef,useState} from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import {Button} from 'antd';
import * as applicationsService from '../api/asset';
import './map.less';
import { useMemoizedFn } from 'ahooks';

/**
 * 预处理判断 某个点是否在某个区域
 * @param {*} lng 
 * @param {*} lat 
 * @param {*} points such as '120.133446,30.271645||120.133153,30.271669||120.133138,30.271595||'
 */
const preceedPointInArea = (lng, lat, points) => {
  let parking_gps = points.join('||')
  let gpsStringArray = parking_gps.split('||')
  let polygon = []
  for (let index in gpsStringArray) {
      let item = gpsStringArray[index]
      let point = item.split(',')
      if (point.length == 2) {
          point['lng'] = parseFloat(point[0])
          point['lat'] = parseFloat(point[1])
          polygon.push(point)
      }
  }
  let flag = isPointInPolygon(polygon, lng, lat)

  return flag;
}


/**
* 某个点是否在某个区域
*/
const isPointInPolygon = (polygon, lng, lat) => {

  let numberOfPoints = polygon.length;
  let polygonLats = [];
  let polygonLngs = [];
  for (let i = 0; i < numberOfPoints; i++) {
      polygonLats.push(polygon[i]['lat']);
      polygonLngs.push(polygon[i]['lng']);
  }

  let polygonContainsPoint = false;
  for (let node = 0, altNode = (numberOfPoints - 1); node < numberOfPoints; altNode = node++) {
      if ((polygonLngs[node] > lng != (polygonLngs[altNode] > lng))
          && (lat < (polygonLats[altNode] - polygonLats[node])
              * (lng - polygonLngs[node])
              / (polygonLngs[altNode] - polygonLngs[node])
              + polygonLats[node]
          )
      ) {
          polygonContainsPoint = !polygonContainsPoint;
      }
  }

  return polygonContainsPoint;
}
const getAreaId = (lngLat,area)=>{
  let id = '';
  area.forEach((item)=>{
    const flag = preceedPointInArea(lngLat[0],lngLat[1],item?.coordinates || [])
    if(flag) {
      id = item.data_id; 
    }
  })
  return id
}

const Map = (props) => {
  const { data,updateData,styles={},zoom=14 } = props;
  const [newData,setNewData] = useState()
  const [type,setType]  = useState('point');
  const [area,setArea] = useState([]);
  const ref = useRef();
  
  const getArea = async()=>{
    const {data} = await applicationsService.queryAll();
    setArea(data?.area ? data?.area.filter((item)=>item.type === 'area') : [])
  }

  useEffect(()=>{
    if(ref.current && !ref?.current?.map){
      const lngLat = data ? JSON.parse(data)?.list?.[0]?.lngLat ?? '' : ''
      ref.current.map = new mapboxgl.Map({
        container: ref.current,
        zoom: zoom,
        center: lngLat || [116.471175,31.659480],
        style: 'http://223.243.100.141:35931/jingdian_mapbox/Code2/style.json',
      });
      ref.current.pointMarks = [];
      getArea()
    }
  },[ref,type,data,zoom])

  const initMap = useMemoizedFn(()=>{
    const _data = data ? JSON.parse(data) : {};
    if(props.isDetail && newData && newData?.type && JSON.stringify(newData) !== data){
      if(newData?.type === 'point'){
        ref.current.pointMarks.forEach((item)=>{
          item.remove()
        })
      }else{
        if(newData?.type !== _data?.type){
          ref.current.map.removeLayer('line-area');
          ref.current.map.removeLayer('line-area-stroke')
        }
      }
    }
    setNewData(_data ?? {});
    setType(_data?.type || 'point');
    if(_data?.type === 'area'){
      ref?.current?.map.on("load", () => {
        const features = [];
        let coordinates = [];
        if(_data?.list && _data?.list?.length > 0){
          _data?.list?.forEach((item)=>{
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: item?.lngLat ?? []
              }
            })
            coordinates.push(item?.lngLat ?? [])
          })
        }
        
        
        ref?.current?.map.addSource('points-area', {
          type: 'geojson',
          data:  {
            'type': 'FeatureCollection',
            'features': []
          }
        });
        
        ref?.current?.map.addSource('line-area', {
          type: 'geojson',
          data:  {
            'type': 'FeatureCollection',
            'features': []
          }
        });
        
        ref?.current?.map.addLayer({
          id: 'line-area',
          type: 'fill',
          source: 'line-area',
          paint: {
            'fill-color': '#807ffe',
            'fill-opacity': 0.8
          }
        });
        ref?.current?.map.addLayer({
          id: 'line-area-stroke',
          type: 'line',
          source: 'line-area',
          paint: {
            'line-color': '#ff0000',
            'line-width': 3,
            'line-opacity': 0.8,
            'line-dasharray': [2,4]
          }
        });
        coordinates = coordinates.concat([coordinates[0]]);
        let json = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        };
        ref?.current?.map.getSource('points-area').setData({
          'type': 'FeatureCollection',
          'features': features
        });
        ref?.current?.map.getSource('line-area').setData(json);
      })
    }else{
      (_data?.list && _data?.list?.length > 0) && _data?.list.forEach((item)=>{
        const pointMark = new mapboxgl.Marker().setLngLat(item?.lngLat ?? []).addTo(ref.current.map);
        ref.current.pointMarks.push(pointMark);
      })
    }
  })

  useEffect(()=>{
    if((!newData || (newData && JSON.stringify(newData) !== data && props.isDetail)) && ref?.current?.map && data){
      initMap()
    }
  },[data,newData,initMap,props.isDetail])

  
  
  const handleAreaRange = useMemoizedFn((e)=>{
    if(!ref?.current?.map){
      return
    }
    const {map} = ref.current
    map.getCanvas().style.cursor = 'crosshair';
    e.stopPropagation();
    // clearLayerAndSource();
    let isMeasure = true;
    // 禁止双击缩放
    map.doubleClickZoom.disable();
    setType('area');
    setNewData({});
    ref.current.pointMarks.forEach((item)=>{
      item.remove()
    })
    let jsonPoint = {
      'type': 'FeatureCollection',
      'features': []
    };
    let jsonLine = {
      'type': 'FeatureCollection',
      'features': []
    };
    let points = [];
    let source = map.getSource('points-area');
    if (source) {
      map.getSource('points-area').setData(jsonPoint);
      map.getSource('line-area').setData(jsonLine);
    } else{
      map.addSource('points-area', {
        type: 'geojson',
        data: jsonPoint
      });
      map.addSource('line-area', {
        type: 'geojson',
        data: jsonLine
      });
    }
    map.addLayer({
      id: 'line-area',
      type: 'fill',
      source: 'line-area',
      paint: {
        'fill-color': '#807ffe',
        'fill-opacity': 0.8
      }
    });
    map.addLayer({
      id: 'line-area-stroke',
      type: 'line',
      source: 'line-area',
      paint: {
        'line-color': '#ff0000',
        'line-width': 3,
        'line-opacity': 0.8,
        'line-dasharray': [2,4]
      }
    });

    function addPoint(coords) {
      jsonPoint.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      });
      map.getSource('points-area').setData(jsonPoint);
    }

    map.on('click', function (_e) {
      if (isMeasure) {
        let coords = [_e.lngLat.lng, _e.lngLat.lat];
        points.push(coords);
        addPoint(coords);
      }
    });

    map.on('dblclick', function (_e) {
      if (isMeasure) {
        let coords = [_e.lngLat.lng, _e.lngLat.lat];
        points.push(coords);
        isMeasure = false;
        setNewData((prev)=>{
          const newData = prev ? JSON.parse(JSON.stringify(prev)) : {}
          if(!newData?.list){
            newData.list = []
          }
          const filterPoints = []
          points.forEach((item)=>{
            const _index = filterPoints.findIndex((_item)=>JSON.stringify(_item.lngLat)===JSON.stringify(item))
            if(_index === -1){
              filterPoints.push({lngLat:item});
            }
          })
          newData.type = 'area';
          newData.list = filterPoints;
          console.log('===',filterPoints,newData)
          // onChange && onChange(JSON.stringify(newData))
          updateData && updateData(JSON.stringify(newData))
          return newData
        })
        map.getCanvas().style.cursor = 'grab'
      }
    });

    map.on('mousemove', function (_e) {
      if (isMeasure) {
        let coords = [_e.lngLat.lng, _e.lngLat.lat];
        let len = jsonPoint.features.length;
        if (len != 0 && len != 1) {
          let pts = points.concat([coords]);
          pts = pts.concat([points[0]]);
          let json = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [pts]
            }
          };
          map.getSource('line-area').setData(json);
        }
      }
    });
  })

  const handlePointerClick = useMemoizedFn((e)=>{
    if(!ref?.current?.map){
      return
    }
    if(type !== 'point'){
      setNewData({})
      ref.current.map.removeLayer('line-area');
      ref.current.map.removeLayer('line-area-stroke')
    }else{
      setNewData({});
      ref.current.pointMarks.forEach((item)=>{
        item.remove()
      })
    }
    setType('point')
    
    ref.current.map.getCanvas().style.cursor = 'crosshair';
    e.stopPropagation();
    ref.current.isDraw = true;
    // 禁止双击缩放
    ref.current.map.doubleClickZoom.disable();
    ref.current.map.on('click', function (_e) {
      if (ref.current.isDraw) {
        ref.current.map.getCanvas().style.cursor = 'grab'
        ref.current.isDraw = false;
        let endCoords = [_e.lngLat.lng, _e.lngLat.lat];
        const pointMark = new mapboxgl.Marker().setLngLat(endCoords).addTo(ref.current.map);
        ref.current.pointMarks.push(pointMark);
        setNewData((prev)=>{
          let _newData = prev ? JSON.parse(JSON.stringify(prev)) : {}
          if(prev?.type !== 'point'){
            _newData = {}
          }
          if(!_newData?.list){
            _newData.list = []
          }
          _newData.type = 'point';
          const _obj = {lngLat:endCoords};
          let areaId = getAreaId(endCoords,JSON.parse(JSON.stringify(area))) || '';
          if(areaId){
            _obj['areaId'] = areaId;
          }
          _newData.list.push(_obj);
          // onChange && onChange(JSON.stringify(_newData))
          updateData && updateData(JSON.stringify(_newData))
          return _newData
        })
      }
    })
  })

  return <div style={{width: '100%',position: 'relative',height: '600px',overflow: 'hidden',...styles}}>
      {!props?.isDetail && <>
        <Button type="primary" onClick={handleAreaRange} style={{margin: '10px',zIndex: 1}}>地图划区</Button>
        <Button type="primary" onClick={handlePointerClick} style={{margin: '10px',zIndex: 1}}>标点</Button>
      </>}
      <div ref={ref} id="map" style={{ width: "100%", height: "100%",position: "absolute",top: 0,bottom: 0}} className="marker">
      </div>
  </div>;
};



export default Map;
