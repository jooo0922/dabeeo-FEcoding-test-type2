"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import randomPos from "./utils";
import "./style.css";

// Marker 의 랜덤한 숫자 범위는 1개 ~ 30개 사이로 임의로 정했습니다.
const MAX_MARKER_NUM = 30;
const MIN_MARKER_NUM = 1;

class App {
  constructor() {
    // WebGLRenderer 생성
    this.canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 위신호 제거를 통해 plane(지도)의 모서리 깨짐 현상을 해결했습니다.
    });

    // PerspectiveCamera 생성
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 60, 0);

    // OrbitControls 생성 (마우스 드래그&스크롤을 통한 이동, 회전, 확대/축소 구현에 사용했습니다.)
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Scene 생성
    this.scene = new THREE.Scene();

    // TextureLoader 생성
    this.textureLoader = new THREE.TextureLoader();

    // 지도(이미지)를 입힌 Plane 생성
    {
      const planeSize = 40;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

      // 다운로드 받은 map.png 텍스처 이미지 원본 사이즈가 2907 * 3460 이었기 때문에
      // Three.js 에 의해 자동으로 2의 거듭제곱 수 2048 * 2048 로 변환되었습니다.
      const planeMat = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load("./resources/map.png"),
      });

      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI * -0.5; // plane 을 -90도 회전했습니다.

      this.scene.add(planeMesh);
    }

    // 랜덤한 개수와 위치의 Marker 생성
    this.createMarkers();

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  // 랜덤한 개수와 위치의 Marker 생성
  createMarkers() {
    // 마커들이 계속 카메라를 향하도록 Sprite 객체를 활용해 구현했습니다.
    const spriteMat = new THREE.SpriteMaterial({
      map: this.textureLoader.load("./resources/marker.png"),
    });
    const spriteNum =
      Math.floor(Math.random() * (MAX_MARKER_NUM - MIN_MARKER_NUM + 1)) +
      MIN_MARKER_NUM;
    const posY = 0.5; // 각 마커들이 plane 에서 0.5 정도 떠있게 했습니다.

    for (let i = 0; i < spriteNum; i++) {
      const marker = new THREE.Sprite(spriteMat);
      const markerPos = randomPos();

      marker.position.set(markerPos[0], posY, markerPos[1]);

      this.scene.add(marker);
    }
  }

  // 브라우저 라시이징 시 해상도 및 카메라 비율 조정
  resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // 드로잉 함수 재귀 호출
  animate() {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
