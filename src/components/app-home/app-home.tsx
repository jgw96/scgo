import { Component, Element, State, Prop, Listen } from '@stencil/core';

import { getTracks, searchTracks } from '../../helpers/api';

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
  searchBar: HTMLIonSearchbarElement;

  @Listen('playing')
  playHandler(event: CustomEvent) {
    this.play(event.detail.track, event.detail.url);
  }

  async componentDidLoad() {
    const data = await getTracks();
    this.tracks = data;
  }

  async play(track?, url?: string) {
    this.playing = false;

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

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>SC Go</ion-title>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.goToFave()} icon-only fill="clear">
              <ion-icon name="star"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar color="primary">
          <ion-searchbar onIonInput={() => this.search()} ref={(el: HTMLIonSearchbarElement) => this.searchBar = el}></ion-searchbar>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <track-list tracks={this.tracks}></track-list>

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
    ]
  }
}
