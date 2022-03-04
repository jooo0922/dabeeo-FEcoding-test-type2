"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

class App {
  constructor() {
    // WebGLRenderer 생성
    this.canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    // PerspectiveCamera 생성
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 60, 0);

    // OrbitControls 생성
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Scene 생성
    this.scene = new THREE.Scene();

    // 지도(이미지)를 입힌 Plane 생성
    {
      const planeSize = 40;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

      // 다운로드 받은 map.png 텍스처 이미지 원본 사이즈가 2907 * 3460 이었기 때문에
      // Three.js 에 의해 자동으로 2의 거듭제곱 수 2048 * 2048 로 변환되었습니다.
      const loader = new THREE.TextureLoader();
      const planeMat = new THREE.MeshBasicMaterial({
        map: loader.load("./resources/map.png"),
      });

      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI * -0.5;

      this.scene.add(planeMesh);
    }

    // 조명(직사광) 생성
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);

      light.position.set(0, 0, 60);

      this.scene.add(light);
    }

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
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
