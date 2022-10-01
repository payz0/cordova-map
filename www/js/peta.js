var inputAlamat = document.getElementById('alamat')
var btn = document.getElementById('cari')
var list = document.getElementById('list')
// lat: "-2.69724685"
// lon: "111.6295558758489"
inputAlamat.addEventListener('keyup',()=>{
    var daftar = []
    if(/\s/.test(inputAlamat.value)){
        list.innerHTML = ''
        daftar = getAlamat("https://nominatim.openstreetmap.org/search.php?q="+inputAlamat.value+"&format=jsonv2")
        daftar.forEach(element => {
            var ul = document.getElementById('list')
            var li = document.createElement('li')
            li.appendChild(document.createTextNode(element.display_name))
            li.classList.add("bg-gray-200/70","border-b","border-gray-300","px-4","hover:bg-gray-100")
            li.setAttribute("onclick","goto('"+element.lat+"','"+element.lon+"','"+element.display_name+"')")
            ul.appendChild(li)
        });
    }
})


function goto(lat,lon,lokasi){
    list.innerHTML = ''
    map.flyTo([lat,lon],16)
    marker = L.marker([lat,lon]).addTo(map)
    marker.bindPopup("<b>Lokasi</b><br>"+lokasi).openPopup();
}

btn.addEventListener('click',()=>{
    var almt = inputAlamat.value
    var cariAlamat = getAlamat("https://nominatim.openstreetmap.org/search.php?q="+almt+"&format=jsonv2")
    map.removeLayer(marker)
    map.panTo(new L.LatLng(cariAlamat[0].lat,cariAlamat[0].lon))
    map.setView([cariAlamat[0].lat,cariAlamat[0].lon],16)
    marker = L.marker([cariAlamat[0].lat,cariAlamat[0].lon]).addTo(map)
    marker.bindPopup("<b>Alamat ini</b><br>"+almt).openPopup();
    console.log(cariAlamat)
})
var map = L.map('map').setView([-2.6853911, 111.6322278], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
var marker = L.marker([-2.6853911, 111.6322278]).addTo(map);
marker.bindPopup("<b>Alamat Kita!</b><br> ini alamat saya.").openPopup();
map.on('click',(e)=>{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    var alamat = getAlamat("https://nominatim.openstreetmap.org/reverse.php?lat="+e.latlng.lat+"&lon="+e.latlng.lng+"&zoom=18&format=jsonv2").display_name
    map.removeLayer(marker)
    marker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
    marker.bindPopup("<b>Alamat ini</b><br>"+alamat).openPopup();
    
})

// routing
var rute = L.Routing.control({
    show:false,
    // addWaypoints: false,
    // draggableWaypoints: true,
    // fitSelectedRoutes: true,
    waypointMode: 'snap',
    waypoints: [
      L.latLng(-2.6853911, 111.6322278),
      L.latLng(-2.69724685, 111.6295558758489)
    ],
    lineOptions: {
        styles: [{color: 'blue', opacity: 1, weight: 5}]
    },
  }).addTo(map);

// moving marker
// var coord = []
rute.on('routeselected', function(e) {
    var line = L.polyline(e.route.coordinates)
    myMovingMarker = L.animatedMarker(line.getLatLngs(),{
        distance:300,
        interval:5000
    })
    map.addLayer(myMovingMarker)
});


function getAlamat(url){
    var getHttp = new XMLHttpRequest();
    getHttp.open("GET",url,false);
    getHttp.send(null)
    return JSON.parse(getHttp.responseText);
}