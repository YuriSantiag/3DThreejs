import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ContactFormWithModel() {
  const [showModel, setShowModel] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const sceneRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef();
  const controlsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      const width = window.innerWidth * 0.7;
      const height = window.innerHeight * 0.7;
      renderer.setSize(width, height);
      rendererRef.current = renderer;
      sceneRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 10, 10);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load(
        'img/scene-27.gltf',
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;
          scene.add(model);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Calcula o deslocamento necessário para centralizar o modelo na cena
          const offset = new THREE.Vector3().subVectors(center, scene.position);
          model.position.sub(offset); // Aplica o deslocamento para centralizar o modelo na cena

          // Ajusta a posição da câmera para visualizar o modelo
          const maxDim = Math.max(size.x, size.y, size.z);
          const distance = maxDim / Math.tan((Math.PI / 180) * camera.fov / 2);
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const zoomFactor = isMobile ? 0.5 : 0.7; // Defina o fator de zoom com base no dispositivo
          const mobileDistanceFactor = isMobile ? 1 : 0.5; // Fator de distância para dispositivos móveis
          camera.position.set(center.x - (maxDim * zoomFactor), center.y, center.z + distance * mobileDistanceFactor);
          camera.lookAt(center);

          const controls = new OrbitControls(camera, renderer.domElement);
          controlsRef.current = controls;
          controls.enableRotate = true; // Permitir apenas rotação
          controls.enableZoom = false; // Desabilitar zoom
          controls.enablePan = false;
          controls.minPolarAngle = Math.PI / 2;
          controls.maxPolarAngle = Math.PI / 2;

          renderer.render(scene, camera);
        },
        undefined,
        (error) => {
          console.error('Erro ao carregar o modelo GLTF', error);
        }
      );

      function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (controlsRef.current) {
          controlsRef.current.dispose();
        }
        if (rendererRef.current && sceneRef.current) {
          sceneRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      };
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário, por exemplo, fazer uma requisição HTTP
    console.log('Nome:', name);
    console.log('Email:', email);
    console.log('Mensagem:', message);
    // Limpar os campos após o envio
    setName('');
    setEmail('');
    setMessage('');
    // Exibir o modelo 3D após o envio do formulário
    setShowModel(true);
  };

  return (
    <div className="relative">
      {showModel && (
        <div ref={sceneRef} className='absolute top-0 left-0' style={{ width: '70vw', height: '70vh', zIndex: 1 }}>
        </div>
      )}
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative" style={{ zIndex: 2 }}>
        <h2 className="text-2xl font-semibold mb-4">Contact me</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700"></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder='Name:'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700"></label>
            <input
              type="email"
              id="email"
              placeholder='Email:'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700"></label>
            <textarea
              id="message"
              name="message"
              placeholder='Message:'
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="md:w-96 md:h-48 px-4 py-4 border rounded-md focus:outline-none focus:border-gray-500"
            ></textarea>
          </div>
          <button type="submit" className="bg-gray-800 hover:scale-105 text-white shadow-xl px-4 py-2 rounded-md">Submit</button>
        </form>
      </div>
    </div>
  );
}