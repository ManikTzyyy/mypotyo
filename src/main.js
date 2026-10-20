import "./style.css";
import { Navbar, initNavbar } from "./layout/navbar";
import { Hero } from "./layout/hero";
import { About } from "./layout/about";
import { Porto } from "./layout/porto";
import { initObject3D } from "./utility/object3d";




import { createIcons, Menu, X } from "lucide";

import { initSmoothScroll } from "./utility/lenis";


initSmoothScroll();

document.querySelector("#app").innerHTML = `
${Navbar()}
${Hero()}
${About()}
${Porto()}
`;

createIcons({
  icons: {
    Menu,
    X
  },
});

initNavbar();

const container = document.querySelector("#object-3d");

const cleanup = initObject3D(container);