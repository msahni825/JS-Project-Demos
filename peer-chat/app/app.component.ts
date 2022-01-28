import { Component, OnInit, ViewChild } from '@angular/core';
// import { connect } from 'http2';
// import { Stream } from 'stream';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('myvideo') myVideo: any;

  peer: any;
  anotherId: any;
  mypeerId: any;

  constructor(){  }

  ngOnInit(){
    this.peer = new Peer();
    setTimeout(() => {
      this.mypeerId = this.peer.id;
    },3000);

    this.peer.on('connection', function(conn: { on: (arg0: string, arg1: (data: any) => void) => void; }){
      conn.on('data', function(data){
        console.log(data);
      });
    });
    let video = this.myVideo.nativeElement;
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    this.peer.on('call', function(call: { answer: (arg0: any) => void; on: (arg0: string, arg1: (remotestream: any) => void) => void; }){
      n.getUserMedia({video: true, audio: true}, function(stream: any){
        call.answer(stream);
        call.on('stream', function(remotestream){
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }, function(err: any){
        console.log('Failed to get stream', err);
      })
    })
  }
  connect(){
    var conn = this.peer.connect(this.anotherId);
    conn.on('open', function(){
      conn.send('Message from that Id: ')
    });
  }
  videoconnect(){
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var firstName = this.anotherId;
    
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    n.getUserMedia({video: true, audio: true}, function(stream: any){
      var call = localvar.call(firstName, stream)
      //call.answer(stream);
        call.on('stream', function(remotestream: Blob | MediaSource){
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }, function(err: any){
        console.log('Failed to get stream', err);
      })
  }
}