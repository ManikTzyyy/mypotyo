export function Hero(){
    return `
<section id="hero" class="min-h-screen relative border-b border-slate-500 flex flex-col justify-center overflow-hidden">
    <div class="text-7xl md:text-9xl font-extrabold text-slate-200 text-center px-1 text-nowrap">LOREM IPSUM</div>
    <div class="mb-40 px-2 text-sm text-slate-700">console.log("Hello World!");</div>
    <div class="absolute left-0 bottom-0 bg-slate-900/10 backdrop-blur-md p-2 rounded-xl">
        Info
    </div>
    <div id="object-3d" class="w-full h-screen absolute z-10"></div>
</section>    

`
}