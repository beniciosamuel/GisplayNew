const socket = io();
var datauser;
var arrId = []

$(window).on('load', () => {
  dbOpera.verifyUser().then((userinfo) => {
    dbOpera.readData('Multiplay-70DE/recused/').then((recList) => {
      if (recList) {
        Object.keys(recList).forEach((user) => {
          if (user == userinfo.displayName) {
            operaUsers.deleteUser();
          }
        })
      }
    })
  })
})

$(document).ready(() => {    
    dbOpera.verifyUser().then((data) => {
      if (data) {
        dbOpera.readData('Multiplay-70DE/users/' + data.displayName).then((infos) => {
          datauser = infos;
          if (datauser == null || datauser.approved == false) {
            window.location.assign("/login");
            console.log("Usuário não está logado!")            
          }
          if (datauser.credential == 'basic')  {
            // document.getElementById('bg').setAttribute('class', 'fade out');
            // document.getElementById('loader').setAttribute('class', 'fade out');
            document.getElementById('manageUsers').remove()
          }              
          // if (datauser.credential == 'premium' || datauser.credential == 'developer')  {
          //   document.getElementById('bg').setAttribute('class', 'fade out');
          //   document.getElementById('loader').setAttribute('class', 'fade out');            
          // }    
          if (datauser.teams != 'projetos') {
            document.getElementById('promoteUser').remove();
          }
          console.log("Usuário logado!")
        })
      } else {
        window.location.assign("/login");
        console.log("Usuário não está logado!")
      }
    })

    $('#btn_signOut').click(() => {
      let info = 'Você está saindo!';
      let objinfo = document.createTextNode(info);
      let spaninfo = document.createElement('span');
      spaninfo.appendChild(objinfo);
      document.getElementById('infotoast').appendChild(spaninfo);
      $("#msg").toast('show');
      setTimeout(() => {
        spaninfo.remove();
        dbOpera.dislog();
      }, 3000);      
    })
    
    $('#checkUsers').click(() => {
      if (datauser.teams != 'projetos') {
        operaUsers.getListPendets(datauser.teams).then((list) => {
          if (list) {
            Object.keys(list).forEach(element => {
              const id = Math.random().toString(36).substring(0, 10).replace('.', '');
              arrId.push(id)
              let instobja = document.createElement('a');
              let instobji = document.createElement('i');
              let instobjdiv = document.createElement('div');
              let instobjstrong = document.createElement('strong');
              let name = document.createTextNode(element)
              instobji.setAttribute('class', 'fas fa-user-times')
              instobji.style.margin = '.5vw'
              instobja.setAttribute('class', 'list-group-item list-group-item-action')
              instobja.style.cursor = 'pointer';
              instobjdiv.setAttribute('class', 'd-flex w-100 align-items-center justify-content-between')
              instobjstrong.setAttribute('class', 'mb-1')
              instobjstrong.appendChild(instobji)
              instobjstrong.appendChild(name)
              instobja.style.cursor = 'pointer'
              instobjdiv.appendChild(instobjstrong)
              instobja.appendChild(instobjdiv)
              instobja.setAttribute('data-bs-toggle', 'list')
              instobja.setAttribute('id', id)
              instobja.setAttribute('value', element)
              document.getElementById('listUsers').appendChild(instobja)
            });
          }
        })
      } else {
        constructorProjects()
      }
    })

    $('#configUsers').click(() => {
      dbOpera.readData('Multiplay-70DE/users').then((users) => {
        for (user in users) {
          const id = Math.random().toString(36).substring(0, 10).replace('.', '');
          arrId.push(id);
          let instobja = document.createElement('a');
          let instobji = document.createElement('i');
          let instobjdiv = document.createElement('div');
          let instobjstrong = document.createElement('strong');
          let name = document.createTextNode(user)
          instobji.setAttribute('class', 'fas fa-address-book')
          instobji.style.margin = '.5vw'
          instobja.setAttribute('class', 'list-group-item list-group-item-action')
          instobja.style.cursor = 'pointer';
          instobjdiv.setAttribute('class', 'd-flex w-100 align-items-center justify-content-between')
          instobjstrong.setAttribute('class', 'mb-1')
          instobjstrong.appendChild(instobji)
          instobjstrong.appendChild(name)
          instobja.style.cursor = 'pointer'
          instobjdiv.appendChild(instobjstrong)
          instobja.appendChild(instobjdiv)
          instobja.setAttribute('data-bs-toggle', 'list')
          instobja.setAttribute('id', id)
          instobja.setAttribute('value', users[user].email)
          document.getElementById('listUsersSector').appendChild(instobja)
        }
      })
    })
    
    $('#closePendents').click(() => {
      if (arrId) {
        Object.values(arrId).forEach((el) => {
          node = document.getElementById(el);
          document.getElementById('listUsers').removeChild(node);
        })
      }
    
      arrId = [];
    })

    $('#closeConfig').click(() => {
      if (arrId) {
        Object.values(arrId).forEach((el) => {
          node = document.getElementById(el);
          document.getElementById('listUsersSector').removeChild(node);
        })
      }
    
      arrId = [];
    })
    
    $('#acceptUser').click(() => {
      let active = document.getElementsByClassName('list-group-item active')
      dbOpera.readData('Multiplay-70DE/users/' + active[0].innerText).then((infos)=> {
        operaUsers.aprroveUser(active[0].innerText).then((status) => {
          new Promise ((res, rej) => {
            res(arrId.splice(arrId.indexOf(active[0].getAttribute('value')), 1))
          }).then(opera => {
            active[0].remove()
          })          
          let info = 'O Usuário ' + active[0].getAttribute('value') + ' foi aceito!';
          let objinfo = document.createTextNode(info);
          let spaninfo = document.createElement('span');
          spaninfo.appendChild(objinfo);
          document.getElementById('infotoast').appendChild(spaninfo);
          $("#msg").toast('show');
          setTimeout(() => {
            spaninfo.remove();
          }, 8000);
        })
      })
    })

    $('#promoteUser').click(() => {
      let active = document.getElementsByClassName('list-group-item active')
      dbOpera.readData('Multiplay-70DE/users/' + active[0].innerText).then((infos)=> {
        operaUsers.promoteUser(active[0].innerText).then((status) => {          
          let info = 'O Usuário ' + active[0].getAttribute('value') + ' foi promovio a Premium!';
          let objinfo = document.createTextNode(info);
          let spaninfo = document.createElement('span');
          spaninfo.appendChild(objinfo);
          document.getElementById('infotoast').appendChild(spaninfo);
          $("#msg").toast('show');
          setTimeout(() => {
            spaninfo.remove();
          }, 8000);
        }).catch(err => {
          let info = 'Houve um erro!';
          let objinfo = document.createTextNode(info);
          let spaninfo = document.createElement('span');
          spaninfo.appendChild(objinfo);
          document.getElementById('infotoast').appendChild(spaninfo);
          $("#msg").toast('show');
          setTimeout(() => {
            spaninfo.remove();
          }, 8000);
        })
      })
    })

    $('#rejectUser').click(() => {
      let active = document.getElementsByClassName('list-group-item active')
      operaUsers.recuseUser(active[0].innerText).then((status) => {
        arrId.splice(arrId.indexOf(active[0].attributes.id.value), 1)
        active[0].remove()
        let info = 'O Usuário ' + active[0].getAttribute('value') + ' foi recusado!';
        let objinfo = document.createTextNode(info);
        let spaninfo = document.createElement('span');
        spaninfo.appendChild(objinfo);
        document.getElementById('infotoast').appendChild(spaninfo);
        $("#msg").toast('show');
        setTimeout(() => {
          spaninfo.remove();
        }, 8000);
      })
    })

    $('#resettPass').click(() => {
      let active = document.getElementsByClassName('list-group-item active');      
      operaUsers.redefinePass(active[0].getAttribute('value')).then((status) => {
        let info = 'Um email para redefinição de senha foi enviado para ' + active[0].getAttribute('value');
        let objinfo = document.createTextNode(info);
        let spaninfo = document.createElement('span');
        spaninfo.appendChild(objinfo);
        document.getElementById('infotoast').appendChild(spaninfo);
        $("#msg").toast('show');
        setTimeout(() => {
          spaninfo.remove();
        }, 8000);
      })
    })

    $('#delUser').click(() => {
      let active = document.getElementsByClassName('list-group-item active');
      operaUsers.recuseUser(active[0].innerText).then((status) => {
        let info = 'O usuário ' + active[0].innerText + ' foi expulso do sistema.';
        let objinfo = document.createTextNode(info);
        let spaninfo = document.createElement('span');
        spaninfo.appendChild(objinfo);
        document.getElementById('infotoast').appendChild(spaninfo);
        $("#msg").toast('show');
        setTimeout(() => {
          spaninfo.remove();
        }, 8000);
      })
    })
})

function constructorProjects () {
  operaUsers.getListPendetsProjects().then((listraw) => {
    if (listraw) {
      Object.values(listraw).forEach((list) => {
        if (list) {
          Object.keys(list).forEach(element => {
            const id = Math.random().toString(36).substring(0, 10).replace('.', '');
            arrId.push(id)
            let instobja = document.createElement('a');
            let instobji = document.createElement('i');
            let instobjdiv = document.createElement('div');
            let instobjstrong = document.createElement('strong');
            let name = document.createTextNode(element)
            instobji.setAttribute('class', 'fas fa-user-times')
            instobji.style.margin = '.5vw'
            instobja.setAttribute('class', 'list-group-item list-group-item-action')
            instobja.style.cursor = 'pointer';
            instobjdiv.setAttribute('class', 'd-flex w-100 align-items-center justify-content-between')
            instobjstrong.setAttribute('class', 'mb-1')
            instobjstrong.appendChild(instobji)
            instobjstrong.appendChild(name)
            instobja.style.cursor = 'pointer'
            instobjdiv.appendChild(instobjstrong)
            instobja.appendChild(instobjdiv)
            instobja.setAttribute('data-bs-toggle', 'list')
            instobja.setAttribute('id', id)
            instobja.setAttribute('value', element)
            document.getElementById('listUsers').appendChild(instobja)
          });
        }
      })
    }
  })
}

socket.on('constructor', (status) => {
  console.log('Aqui2')
  document.getElementById('bg').setAttribute('class', 'fade out');
  document.getElementById('load').setAttribute('class', 'fade out');
})

var center = [-3.740255778720656, -38.497363174129376];

// Create the map
var map = L.map('mapid', {
    zoomControl: true
}).setView(center, 15);
map.zoomControl.setPosition('bottomright');

// Set up the OSM layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYnJpYXJpdXN0ZWNubyIsImEiOiJja2o4ZjlqbWIyM2x4MnFwZGxtempqYmhzIn0.ytMdh_MOTlaynSOSd1VxIQ'
}).addTo(map);

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var drawPluginOptions = {
  position: 'topright',
  draw: {
    polyline: {
      shapeOptions: {
        color: '#f357a1',
        weight: 10
      }
    },
    polygon: {
      allowIntersection: true, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)', // Message that will show when intersect
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    circle: false, // Turns off this drawing tool
    rectangle: {
      shapeOptions: {
        clickable: false
      }
    }
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

let tempObjInMap = [];
let actualColors = {
  polygons: '',
  lines: '',
  squares: '',
  markers: ''
};

map.on('draw:created', (e) => {
  $('#menuDeploy').addClass("in");
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    const shape = layer.toGeoJSON();
    shape.properties = {
        user: "Anonymous",
        pattern: "Standard"
    }
    const shapeStr = JSON.stringify(shape);
    console.log(layer)
  }

  tempObjInMap.push(layer)
  editableLayers.addLayer(layer);
});

$('#cncDep').click(() => {
    $('#menuDeploy').removeClass("in");
    $('#menuDeploy').addClass("out");
    tempObjInMap.forEach((layer) => {
        editableLayers.removeLayer(layer)
    })

    tempObjInMap = [];
})

$('#okDep').click(() => {
  const actualDate = new Date();
  $('#menuDeploy').removeClass("in");
  $('#menuDeploy').addClass("out");
  tempObjInMap.forEach((layer) => {
      const shape = layer.toGeoJSON();
      shape.properties = {
        creator: '',
        datecreate: actualDate.getDate,
        datemodified: '',
        color: ''
      }
      const shapeStr = JSON.stringify(shape);
      console.log(shapeStr)
  })

  tempObjInMap = [];
})

