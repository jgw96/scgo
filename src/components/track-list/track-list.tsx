import { Component, Event, Prop, State, EventEmitter } from '@stencil/core';

import { get, set } from "idb-keyval";

@Component({
  tag: 'track-list',
  styleUrl: 'track-list.css'
})
export class TrackList {

  @State() streamUrl: string;

  @Prop() tracks: any;
  @Prop({ connect: "ion-toast-controller" }) toastCtrl: HTMLIonToastControllerElement;

  @Event() playing: EventEmitter;

  async play(track?, url?: string) {
    this.playing.emit({ track, url });
  }

  async next() {
    const randomNumber = Math.random();;
    await this.play(this.tracks[Math.floor(randomNumber * this.tracks.length)], this.tracks[Math.floor(randomNumber * this.tracks.length)].stream_url);
  }

  async fave(track) {
    const items = await (get("faveTracks") as any);

    if (items !== undefined) {
      items.push(track);
      await set("faveTracks", items);
      await this.showSaveToast();
    } else {
      await set("faveTracks", [track]);
      await this.showSaveToast();
    }
  }

  async showSaveToast() {
    const toast = await this.toastCtrl.create({
      message: "Song favorited",
      duration: 1700
    });
    await toast.present();
  }

  render() {
    const tracks = this.tracks.map((track) => {
      if (track.artwork_url) {
        return (
          <ion-item key={track.id} class="track">
            <ion-thumbnail onClick={() => this.play(track, track.stream_url)} slot="start">
              <ion-img src={track.artwork_url} alt={`${track.name} album artwork`}></ion-img>
            </ion-thumbnail>

            <ion-label onClick={() => this.play(track, track.stream_url)}>
              <h2>{track.title}</h2>
              <p>{track.description || "No Description Available"}</p>
            </ion-label>

            <ion-buttons slot="end">
              <ion-button color="primary" onClick={() => this.fave(track)} icon-only fill="clear">
                <ion-icon name="star-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        )
      }
    });

    return (
      <ion-list>
        {tracks}
      </ion-list>
    )
  }
}
