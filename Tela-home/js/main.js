
const canvas = document.querySelector('canvas.webgl')

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')
const bodyElement = document.querySelector('body')
const loadingManager = new THREE.LoadingManager(
    () => {
        window.setTimeout(() => {
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value: 0,
                delay: 1
            })
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value: 0,
                delay: 1
            })

            loadingBarElement.classList.add('ended')
            bodyElement.classList.add('loaded')
            loadingBarElement.style.transform = '';
            loadingBarElement.textContent = '';
           
        }, 500)
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl, itemsLoaded, itemsTotal)
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(progressRatio)
    },
    () => {

    }
)
const gltfLoader = new THREE.GLTFLoader(loadingManager)



// Scene
const scene = new THREE.Scene()



const overlayGeometry = new THREE.PlaneGeometry(4, 4, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, uAlpha);
           
        }
    `,
    uniforms: {
        uAlpha: {
            value: 1.0
        }
    },
    transparent: true
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay)


/**z
 * GLTF Model
 */
let brain = null

gltfLoader.load(
    './assets/brain/scene.gltf',
    (gltf) => {
        console.log(gltf);

        brain = gltf.scene

        const radius = 1.2

        brain.position.x = 1.3
     
        


        brain.rotation.x = Math.PI * 0.
        brain.rotation.z = Math.PI * 0,6
        brain.rotation.y = Math.PI * 0.4

       
        
        
       
        

        brain.scale.set(radius, radius, radius)

        scene.add(brain)
    },
    (progress) => {
        console.log(progress);
    },
    (error) => {
        console.error(error);
    }
)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 2, 0)

directionalLight.castShadow = true
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

const transformbrain = [{
        rotationZ: 0.,
        rotationY: 1.5,
        positionX: 1.4
        
    },
    {
        rotationZ: -0.5,
        rotationY: -1.5,
        positionX: -1.4
       
    },
    {
        rotationZ: 0.0314,
        rotationY: 0.5,
        positionX: -0.2,
    },
    {
        rotationZ: 0.0314,
        rotationY: 0,
        positionX: 0
    },
]

window.addEventListener('scroll', () => {

    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    console.log(newSection);

    if (newSection != currentSection) {
        currentSection = newSection

        if (!!brain) {
            gsap.to(
                brain.rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    y: transformbrain[currentSection].rotationY, 
                    z: transformbrain[currentSection].rotationZ
                }
            )
            gsap.to(
                brain.position, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: transformbrain[currentSection].positionX,
                    y:transformbrain[currentSection].rotationZ 
                }
            )

          
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5

scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    if (!!brain) {
        brain.position.y = Math.sin(elapsedTime * .5) * .1 - 0.1
      
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * On Reload
 */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
