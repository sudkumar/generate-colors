<script>
  import { getColorForString } from "./../src"

  $: value = ""
  $: brightness = 35
  $: saturation = undefined
  $: color = `rgb(${getColorForString(value, { brightness: brightness, saturation: saturation }).join(',')})`
</script>
<style>
  .text-center {text-align: center;}
  .outline-none { outline: none !important;}
  .bg-white { background: white; }
  .block { display: block; }
  .flex { display: flex; }
  .flex-1 { flex: 1; }
  .w-full { width: 100%; }
  .p-4 { padding: 1rem;}
  .pr-4 { padding-right: 1rem; }
  .text-lg { font-size: 1.25rem; }
  .max-w-sm { max-width: 756px; }
  .mx-auto { margin-left: auto; margin-right: auto;}
  .rounded { border-radius: 0.25rem; }
  .rounded-lg { border-radius: 1rem; }
  .border { border: 2px solid black; }
</style>

<div class="max-w-sm mx-auto">
  <div class="p-4">
    <h1>Generate Colors for strings (Playground)</h1>
  </div>
  <div class="p-4">
    <div class="flex">
      <div class="flex-1 pr-4">
        <label for="string">String Value</label>
        <input
          id="string"
          type="text"
          class="block w-full p-4 text-lg outline-none rounded-lg border"
          bind:value={value}
          placeholder="Type here to see the background change..."
        />
      </div>
      <div class="pr-4">
        <div>
          <label for="brightness">Brightness</label> <a href="https://en.wikipedia.org/wiki/Brightness" target="_blank"
          rel="no-openner no-referrer">?</a>
        </div>
        <input
          id="brightness"
          min={0}
          max={100}
          type="number"
          class="block p-4 text-lg outline-none border rounded-lg"
          bind:value={brightness}
          placeholder="Brightness/Value of color (HSV)"
          />
      </div>
      <div>
        <div>
          <label for="saturation">Saturation</label> <a href="https://en.wikipedia.org/wiki/Colorfulness" target="_blank"
          rel="no-openner no-referrer">?</a>
        </div>
        <input
          id="saturation"
          min={0}
          max={100}
          type="number"
          class="block p-4 text-lg outline-none border rounded-lg"
          bind:value={saturation}
          placeholder="Saturation or Colorfulness"
          />
      </div>
    </div>
    <h2>Color: {color}</h2>
    <div style="background: {color}; height: 60px; margin-top: 20px;" class="rounded">
    </div>
  </div>
</div>
