import { Component, Element, State, Prop, Listen } from '@stencil/core';

import { getTracks, searchTracks } from '../../helpers/api';

// declare var MediaMetadata: any;

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @State() tracks: any[] = [];
  @State() streamUrl: string;
  @State() playing: boolean;
  @State() currentPlayingTrack: any = {};

  @Prop({ connect: "ion-toast-controller" }) toastCtrl: HTMLIonToastControllerElement;

  @Element() el: HTMLElement;

  audioElement: HTMLAudioElement;
  moreInfoElement: HTMLElement;
  searchBar: HTMLIonSearchbarElement;
  closeAnimation: Animation;
  opened: boolean;

  @Listen('playing')
  playHandler(event: CustomEvent) {
    this.play(event.detail.track, event.detail.url);
  }

  async componentDidLoad() {
    (window as any).requestIdleCallback(async () => {
      const data = await getTracks();
      this.tracks = data;
    });
  }

  async play(track?, url?: string) {
    this.playing = false;

    this.setUpMeta(track);

    if (url) {
      // if we have a new url switch to it
      this.streamUrl = url;

      if (track) {
        this.currentPlayingTrack = track
      }

      this.setUpListeners();
    } else {
      // if not were paused and just play
      await this.audioElement.play();
      this.playing = true;
    }
  }

  setUpMeta(track) {
    console.log(track);

    /*if ((navigator as any).mediaSession) {
      (navigator as any).mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artwork: [
          { src: track.artwork_url, type: 'image/jpg' },
        ]
      });
    }*/
  }

  setUpListeners() {
    this.audioElement.addEventListener('loadeddata', async () => {
      if (this.audioElement.readyState >= 3) {
        await this.audioElement.play();
        this.playing = true;
      }
    });

    this.audioElement.addEventListener('ended', async () => {
      await this.next();
    });
  }

  async pause() {
    await this.audioElement.pause();
    this.playing = false;
  }

  search() {
    setTimeout(async () => {
      const data = await searchTracks(this.searchBar.value);

      this.tracks = data;
    }, 200);
  }

  async next() {
    const randomNumber = Math.random();;
    await this.play(this.tracks[Math.floor(randomNumber * this.tracks.length)], this.tracks[Math.floor(randomNumber * this.tracks.length)].stream_url);
  }

  async goToFave() {
    await (this.el.closest('ion-nav') as HTMLIonNavElement).push('fave-page');
  }

  moreInfo = () => {
    if (this.opened === false || !this.opened) {
      const keyframes = [
        {
          transform: "translateY(240px)"
        },
        {
          transform: "translateY(0px)"
        }
      ];

      this.closeAnimation = this.moreInfoElement.animate((keyframes as any), {
        fill: "forwards",
        duration: 200
      });

      this.opened = true;
    }
  }

  closeInfo = () => {
    this.opened = false;
    this.closeAnimation.reverse();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title mode="ios">SC Go</ion-title>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.goToFave()} icon-only fill="clear">
              <ion-icon aria-label="favorite icon" name="star"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar color="primary">
          <ion-searchbar aria-label="Searchbar" onIonInput={() => this.search()} ref={(el: HTMLIonSearchbarElement) => this.searchBar = el}></ion-searchbar>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <track-list tracks={this.tracks}></track-list>

        <audio ref={(el: HTMLAudioElement) => this.audioElement = el} src={`${this.streamUrl}?client_id=a7Ucuq0KY8Ksn8WzBG6wj4x6pcId6BpU`}></audio>
      </ion-content>,

      <div id='moreInfo' ref={(el: HTMLElement) => this.moreInfoElement = el}>
        <ion-button onClick={this.closeInfo} icon-only fill="clear">
          <ion-icon aria-label="close icon" name="close"></ion-icon>
        </ion-button>

        <h5>{this.currentPlayingTrack.title}</h5>

        <p>{this.currentPlayingTrack.description}</p>

        {this.currentPlayingTrack.release_year ? <p>Released {this.currentPlayingTrack.release_month}/{this.currentPlayingTrack.release_day}/{this.currentPlayingTrack.release_year}</p> : null}

        <span><ion-icon aria-label="star count icon" name="star" color="primary"></ion-icon>{this.currentPlayingTrack.likes_count}</span>
      </div>,

      <ion-footer>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            {this.currentPlayingTrack.title ? <ion-button onClick={this.moreInfo} icon-only fill="clear">
              <ion-icon aria-label="more info icon" name="arrow-up"></ion-icon>
            </ion-button>
              : null}
          </ion-buttons>
          <p id='trackTitle'>{this.currentPlayingTrack.title}</p>
          <ion-buttons slot="end">
            <ion-button fill="clear" icon-only>
              <ion-icon aria-label="skip backward icon" name="skip-backward"></ion-icon>
            </ion-button>
            {this.playing ?
              <ion-button onClick={() => this.pause()} fill="clear">
                <ion-icon aria-label="pause icon" name="pause"></ion-icon>
              </ion-button>
              : <ion-button onClick={() => this.play()} fill="clear" icon-only>
                <ion-icon aria-label="play icon" name="play"></ion-icon>
              </ion-button>}
            <ion-button onClick={() => this.next()} fill="clear" icon-only>
              <ion-icon aria-label="skip forward icon" name="skip-forward"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    ]
  }
}
