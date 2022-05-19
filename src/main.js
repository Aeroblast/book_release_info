import { createApp } from 'vue'
import App from './App.vue'

function pad(n) {
	if (n < 10) {
		return '0' + n;
	}
	return n;
}

Date.prototype.toISOLikeDate = function () {
	return this.getFullYear() +
		'-' + pad(this.getMonth() + 1) +
		'-' + pad(this.getDate())
};

createApp(App).mount('#app')
