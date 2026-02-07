import { createRouter, createWebHistory } from 'vue-router';

import Home from './pages/Home.vue';
import About from './pages/About.vue';
import History from './pages/History.vue';
import Making from './pages/Making.vue';
import Rental from './pages/Rental.vue';
import Portfolio from './pages/Portfolio.vue';
import Contact from './pages/Contact.vue';
import AdminAdministrator from './pages/AdminAdministrator.vue';

const routes = [
	{ path: '/', component: Home, name: 'Home' },
	{ path: '/about', component: About, name: 'About' },
	{ path: '/history', component: History, name: 'History' },
	{ path: '/making', component: Making, name: 'Making' },
	{ path: '/rental', component: Rental, name: 'Rental' },
	{ path: '/portfolio', component: Portfolio, name: 'Portfolio' },
	{ path: '/contact', component: Contact, name: 'Contact' },
	{ path: '/admin/administrator', component: AdminAdministrator, name: 'AdminAdministrator' },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		// 항상 최상단으로
		return { top: 0, left: 0 };
	},
});

export default router;
