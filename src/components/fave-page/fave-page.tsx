import { Component, Prop, State } from '@stencil/core';

import { get } from 'idb-keyval';

@Component({
  tag: 'fave-page',
  styleUrl: 'fave-page.css'
})
export class FavePage {

  @State() faveTracks: any[] = [];
  @State() streamUrl: string;
  @State() playing: boolean;
  @State() currentPlayingTrack: any = {};

  @Prop({ connect: "ion-toast-controller" }) toastCtrl: HTMLIonToastControllerElement;

  audioElement: HTMLAudioElement;
  searchBar: HTMLIonSearchbarElement;

  async componentDidLoad() {
    this.faveTracks = await (get('faveTracks') as any);
  }

  async play(track?, url?: string) {
    this.playing = false;
    console.log('clicked');

    if (url) {
      console.log(url);
      // if we have a new url switch to it
      this.streamUrl = url;

      if (track) {
        this.currentPlayingTrack = track
      }

      this.audioElement.addEventListener('loadeddata', async () => {
        if (this.audioElement.readyState >= 3) {
          console.log('playing');
          await this.audioElement.play();
          this.playing = true;
        }
      });
    } else {
      console.log('resuming')
      // if not were paused and just play
      await this.audioElement.play();
      this.playing = true;
    }
  }

  async pause() {
    console.log('pause clicked');
    await this.audioElement.pause();
    this.playing = false;
  }

  next() {
    console.log('hello world');
    const randomNumber = Math.random();;
    this.play(this.faveTracks[Math.floor(randomNumber * this.faveTracks.length)], this.faveTracks[Math.floor(randomNumber * this.faveTracks.length)].stream_url);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/"></ion-back-button>
          </ion-buttons>
          <ion-title>SC Go</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-list>
          {
            this.faveTracks.map((track) => {
              return (
                <ion-item onClick={() => this.play(track, track.stream_url)} key={track.id} class="track">
                  <ion-thumbnail slot="start">
                    <ion-img src={track.artwork_url || "https://images.all-free-download.com/images/graphiclarge/geometric_abstract_pattern_colorful_flat_circles_decoration_6835129.jpg"}></ion-img>
                  </ion-thumbnail>

                  <ion-label>
                    <h2>{track.title}</h2>
                    <p>{track.description || "No Description Available"}</p>
                  </ion-label>
                </ion-item>
              )
            })
          }
        </ion-list>

        <audio ref={(el: HTMLAudioElement) => this.audioElement = el} src={`${this.streamUrl}?client_id=a7Ucuq0KY8Ksn8WzBG6wj4x6pcId6BpU`}></audio>
      </ion-content>,

      <ion-footer>
        <ion-toolbar>
          <p id='trackTitle'>{this.currentPlayingTrack.title}</p>
          <ion-buttons slot="end">
            <ion-button fill="clear" icon-only>
              <ion-icon color="primary" name="skip-backward"></ion-icon>
            </ion-button>
            {this.playing ?
              <ion-button onClick={() => this.pause()} fill="clear">
                <ion-icon color="primary" name="pause"></ion-icon>
              </ion-button>
              : <ion-button onClick={() => this.play()} fill="clear" icon-only>
                <ion-icon color="primary" name="play"></ion-icon>
              </ion-button>}
            <ion-button onClick={() => this.next()} fill="clear" icon-only>
              <ion-icon color="primary" name="skip-forward"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    ];
  }
}
