// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VwZXJub3ZhMTciLCJhIjoiY2xyNmVpM2dlMmcwbTJsbnZ1d2tvd25qcSJ9.lsN3-AJpJacWGJOIAiJzSQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-73.754968, 42.6511674], // change to your centre
  zoom: 6.5
});
//多url导入
var themes = {
  good: "mapbox://styles/supernova17/cls7yf8at01at01pe5qccbnw7",
  moderate: "mapbox://styles/supernova17/cls81fzh3018g01plf4ak05ne",
  unhealthy: "mapbox://styles/supernova17/cls84mqtp01ef01r4aby591r2",
  aqi: "mapbox://styles/supernova17/cls81g6fh01ek01qyetal0oh6",
  ozone: "mapbox://styles/supernova17/cls86y5ti01ep01qy7tt019qy",
  pm25: "mapbox://styles/supernova17/cls861pvl01eo01qy2qbye36h"
};

// 初始化地图后立即更新样式和年份图层
map.on("load", function () {
  updateThemeAndYear();
});

// 处理主题更改
document.querySelectorAll('input[name="theme"]').forEach((input) => {
  input.addEventListener("change", function () {
    updateThemeAndYear();
  });
});

// 处理年份更改
document.getElementById("yearRange").addEventListener("input", function () {
  document.getElementById("yearLabel").innerText = `Year: ${this.value}`;
  updateYearLayer(this.value);
});

function updateThemeAndYear() {
  const selectedTheme = document.querySelector('input[name="theme"]:checked')
    .value;
  const selectedYear = document.getElementById("yearRange").value;

  // 更新地图样式
  map.setStyle(themes[selectedTheme]);

  // 确保在样式加载完毕后更新年份图层
  map.once("style.load", function () {
    updateYearLayer(selectedYear);
  });
}

function updateYearLayer(selectedYear) {
  const layers = map.getStyle().layers;

  layers.forEach((layer) => {
    if (layer.id === selectedYear) {
      // 直接使用年份作为图层ID
      map.setLayoutProperty(layer.id, "visibility", "visible");
    } else if (!isNaN(layer.id) && layer.id.length === 4) {
      // 检查是否为年份图层
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  });
}

//地理编码器
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in New York", // Placeholder text for the search bar
  proximity: {
    longitude: -73.754968,
    latitude: 42.6511674
  } // Coordinates of Glasgow center
});
map.addControl(geocoder, "top-left");

//导航控件
map.addControl(new mapboxgl.NavigationControl(), "top-left");

//当前位置控件
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);