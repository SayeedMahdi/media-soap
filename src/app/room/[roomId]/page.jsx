"use client"
import React, { useState, useRef, useEffect } from "react"
import  {io}  from "socket.io-client"
const mediasoupClient = require("mediasoup-client")
import { useParams, useRouter } from 'next/navigation';
import { get } from "http";




export default function Page (){
  const urlParams = useParams();
  let userStream;
  const router = useRouter();
  let roomName;



  //  const url = window.location.href
   const inputParams = urlParams.roomId;
   const viewer = inputParams.includes('view-')
   if(viewer){
     roomName = inputParams.split("-")[1]
   }else{
    roomName = inputParams
   }



   //variables
    let device
    let rtpCapabilities
    let producerTransport
    let consumerTransports = []
    let audioProducer
    let videoProducer
    let videoTrack
    let audioTrack


  const videoRef = useRef(null);


  
  const socket = io("https://127.0.0.1:4000/mediasoup",{
    transports: ["websocket", "polling"],
  })

  socket.emit('createRoom', { room_id: roomName }, (response) => {
    console.log("roomId:", response);
  });


   async function  join(name, room_id) {
    socket
      .request('join', {
        name:"Sayeed Mhai",
        room_id:roomName
      })
      .then(
        async function (e) {
          console.log('Joined to room', e)
          const data = await socket.request('getRouterRtpCapabilities')
           device = await loadDevice(data)
          await initTransports(device)
          socket.emit('getProducers')
        }.bind(this)
      )
      .catch((err) => {
        console.log('Join error:', err)
      })
  }

  async function loadDevice(routerRtpCapabilities) {
    let device
    try {
      device = new this.mediasoupClient.Device()
    } catch (error) {
      if (error.name === 'UnsupportedError') {
        console.error('Browser not supported')
        alert('Browser not supported')
      }
      console.error(error)
    }
    await device.load({
      routerRtpCapabilities
    })
    return device
  }

  async function initTransports(device) {
    // init producerTransport
    {
      const data = await this.socket.request('createWebRtcTransport', {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities
      })

      if (data.error) {
        console.error(data.error)
        return
      }

      this.producerTransport = device.createSendTransport(data)

      this.producerTransport.on(
        'connect',
        async function ({ dtlsParameters }, callback, errback) {
          this.socket
            .request('connectTransport', {
              dtlsParameters,
              transport_id: data.id
            })
            .then(callback)
            .catch(errback)
        }.bind(this)
      )

      this.producerTransport.on(
        'produce',
        async function ({ kind, rtpParameters }, callback, errback) {
          try {
            const { producer_id } = await this.socket.request('produce', {
              producerTransportId: this.producerTransport.id,
              kind,
              rtpParameters
            })
            callback({
              id: producer_id
            })
          } catch (err) {
            errback(err)
          }
        }.bind(this)
      )

      this.producerTransport.on(
        'connectionstatechange',
        function (state) {
          switch (state) {
            case 'connecting':
              break

            case 'connected':
              //localVideo.srcObject = stream
              break

            case 'failed':
              this.producerTransport.close()
              break

            default:
              break
          }
        }.bind(this)
      )
    }

    // init consumerTransport
    {
      const data = await this.socket.request('createWebRtcTransport', {
        forceTcp: false
      })

      if (data.error) {
        console.error(data.error)
        return
      }

      // only one needed
      this.consumerTransport = device.createRecvTransport(data)
      this.consumerTransport.on(
        'connect',
        function ({ dtlsParameters }, callback, errback) {
          this.socket
            .request('connectTransport', {
              transport_id: this.consumerTransport.id,
              dtlsParameters
            })
            .then(callback)
            .catch(errback)
        }.bind(this)
      )

      this.consumerTransport.on(
        'connectionstatechange',
        async function (state) {
          switch (state) {
            case 'connecting':
              break

            case 'connected':
              //remoteVideo.srcObject = await stream;
              //await socket.request('resume');
              break

            case 'failed':
              this.consumerTransport.close()
              break

            default:
              break
          }
        }.bind(this)
      )
    }
  }

  
  

// nameInput.value = 'user_' + Math.round(Math.random() * 1000)

// socket.request = function request(type, data = {}) {
//   return new Promise((resolve, reject) => {
//     socket.emit(type, data, (data) => {
//       if (data.error) {
//         reject(data.error)
//       } else {
//         resolve(data)
//       }
//     })
//   })
// }

let rc = null




  return (
    <div id="video" className="mx-auto ">
      <table>
        <thead>
        </thead>
        <tbody>
          <tr className="align-top">
            <td>
              <div className="p-2 rounded-lg bg-slate-200 flex justify-center">
                <audio id="localVideo" ref={videoRef} autoPlay  className="w-96 bg-black mx-2" ></audio>
                <video id="localVideo" ref={videoRef} autoPlay  className="w-96 bg-black mx-2" ></video> 
              </div>
            </td>
            <td>
              <div className="p-2 rounded-lg bg-slate-200 flex justify-center w-46 h-46 ">
                <div id="videoContainer" className="w-46 h-46 overflow-clip"></div>
              </div>
            </td>
            </tr>
          {/* <button onClick={createRoom}>Create a new instance</button> */}
          
        </tbody>
        </table>
        {/* <div className="flex flex-row relative  items-center justify-center">
          <div className="absolute -bottom-64 space-x-2 m-auto">
      <button onClick={disconnect} className="bg-red-600 hover:bg-red-700 rounded-full h-10 w-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-6 w-6 text-white ml-2" viewBox="0 0 512 512">
        <path d="M451 374c-15.88-16-54.34-39.35-73-48.76-24.3-12.24-26.3-13.24-45.4.95-12.74 9.47-21.21 17.93-36.12 14.75s-47.31-21.11-75.68-49.39-47.34-61.62-50.53-76.48 5.41-23.23 14.79-36c13.22-18 12.22-21 .92-45.3-8.81-18.9-32.84-57-48.9-72.8C119.9 44 119.9 47 108.83 51.6A160.15 160.15 0 0083 65.37C67 76 58.12 84.83 51.91 98.1s-9 44.38 23.07 102.64 54.57 88.05 101.14 134.49S258.5 406.64 310.85 436c64.76 36.27 89.6 29.2 102.91 23s22.18-15 32.83-31a159.09 159.09 0 0013.8-25.8C465 391.17 468 391.17 451 374z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
        </svg>
      </button>
      <button onClick={toggleAudio} id="audio-btn" className="hover:bg-slate-200  hover:text-black rounded-full h-10 w-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-6 w-6 text-white ml-2  hover:text-black" viewBox="0 0 512 512">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80"/><path d="M256 64a63.68 63.68 0 00-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
       </svg>

      </button>
      <button className="hover:bg-slate-200  hover:text-black rounded-full h-10 w-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon h-6 w-6 text-white ml-2  hover:text-black" viewBox="0 0 512 512">
        <path d="M336 448h56a56 56 0 0056-56v-56M448 176v-56a56 56 0 00-56-56h-56M176 448h-56a56 56 0 01-56-56v-56M64 176v-56a56 56 0 0156-56h56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
       </svg>

      </button>
      <button onClick={toggleVideo} className={`hover:bg-slate-200 hover:text-black rounded-full h-10 w-10`}>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-white w-6 h-6 ml-2  hover:text-black">
       <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
       </svg>

      </button>
      </div>
      </div> */}
      </div>
      
      
      
    
  )
}
