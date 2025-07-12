<script lang="ts">
	import { translate } from '$i18n';
</script>

<div class="flex h-24 items-center gap-6 bg-blue-800 p-6 text-white">
	<img
		class="h-full object-contain brightness-[100] saturate-0"
		src="/other/mmbs-logo.png"
		alt="MMBS Logo"
	/>

	<div class="flex flex-col justify-center">
		<span class="text-xs">Innovio</span>
		<span class="text-xs">NIP: 7272867774</span>
		<span class="text-xs">REGON: 524884230</span>
	</div>

	<span class="flex-auto"></span>

	<div class="flex flex-col justify-center">
		<span class="text-xs">{$translate('footer.contact')}</span>
		<span class="text-xs">{$translate('footer.phoneNumber')}</span>
		<a class="text-xs" href="mailto:szymonkaszubagalka.innovio@gmail.com">
			{$translate('footer.email')}
		</a>
	</div>

	<!-- TODO: add social media links -->
	<!-- <a class="cursor-pointer" href="#" target="_blank" aria-label="facebook link">
		<i class="fa-brands fa-facebook-f"></i>
	</a>
	<a class="cursor-pointer" href="#" target="_blank" aria-label="instagram link">
		<i class="fa-brands fa-instagram"></i>
	</a>
	<a class="cursor-pointer" href="#" target="_blank" aria-label="linkedin link">
		<i class="fa-brands fa-linkedin"></i>
	</a> -->
</div>
