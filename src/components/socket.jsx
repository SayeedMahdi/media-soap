"use client"
import React, { useEffect, useRef } from "react"
import { io } from "socket.io-client"

export default function Page (){
  const videoRef = useRef(null)
  const constraints = { audio: true, video: true }


  const startVideoChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      videoRef.current.srcObject = stream
      console.log(stream)
    } catch (error) {
      console.error("Error accessing camera and audio:", error)
    }
  }

  useEffect(() => {
    const socket = io("http://192.168.1.105:8000/mediasoup", {
      transports:["websocket"],
    })
    socket.on("connection-success", ({ socketId }) =>{
      console.log(socketId)
    })


  }, [])

  return (
    <div id="video">
      <table>
        <thead>
          <th>Local Video</th>
          <th>Remote Video</th>
        </thead>
        <tbody>
          <tr className="align-top">
            <td>
              <div className="p-5 bg-slate-500 flex justify-center">
                <video id="localVideo" ref={videoRef} autoPlay  className="w-96 bg-black mx-2" ></video>
              </div>
            </td>
            <td>
              <div className="p-5 bg-slate-500 flex justify-center">
                <video id="remoteVideo" autoPlay className="w-96 bg-black mx-2" ></video>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="p-5 bg-slate-500 flex justify-center">
                <button id="btnLocalVideo" onClick={startVideoChat}>1. Get Local Video</button>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="p-5 bg-slate-500 flex justify-center">
                <button id="btnRtpCapabilities" className="m-2">2. Get Rtp Capabilities</button>
                <br />
                <button id="btnDevice">3. Create Device</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="p-5 bg-slate-500 flex justify-center">
                <button id="btnCreateSendTransport">4. Create Send Transport</button>
                <br />
                <button id="btnConnectSendTransport">5. Connect Send Transport & Produce
                </button>
              </div>
            </td>
            <td>
              <div className="p-5 bg-slate-500 flex justify-center">
                <button id="btnRecvSendTransport">6. Create Recv Transport</button>
                <br />
                <button id="btnConnectRecvTransport">7. Connect Recv Transport & Consume</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  )
}
