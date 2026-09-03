<script setup lang="ts">
import Avatar from '@modrinth/ui/src/components/base/Avatar.vue'
import { defineMessages, useVIntl } from '@modrinth/ui/src/composables/i18n.ts'

const { formatMessage } = useVIntl()

interface ShowcasePlugin {
	id: string
	iconUrl: string
	title: string
	description: string
}

interface NexServerPluginIndex {
	updatedAt?: unknown
	plugins?: unknown
}

const PLUGIN_INDEX_URL =
	'https://raw.githubusercontent.com/PCL-Nex-Developer/Nex_Server/refs/heads/main/apiv2/plugin-index.json'
const PLUGIN_REFRESH_INTERVAL = 5 * 60 * 1000

// 纯静态页面和网络失败时使用；浏览器加载后会用 Nex_Server 最新索引替换。
const fallbackPlugins: ShowcasePlugin[] = [
	{
		id: 'codexminecraft.windowglass',
		title: 'Window Glass',
		description: 'Window materials and player experience enhancements',
		iconUrl: 'https://avatars.githubusercontent.com/u/214486054?v=4',
	},
	{
		id: 'com.github.com.pclpro.proaddons',
		title: 'PCL Pro 扩展',
		description: '主题、回声洞与实用功能扩展',
		iconUrl: 'https://avatars.githubusercontent.com/u/251352235?v=4',
	},
	{
		id: 'com.github.pclpro.ntheme',
		title: 'PCL-N Theme',
		description: '为 PCL Nex 提供 PCL-N 风格主题',
		iconUrl: 'https://avatars.githubusercontent.com/u/251352235?v=4',
	},
	{
		id: 'pclnex.easytier',
		title: 'EasyTier 联机大厅',
		description: '独立的 EasyTier 联机大厅插件',
		iconUrl: 'https://avatars.githubusercontent.com/u/256916368?v=4',
	},
	{
		id: 'xjh2009.bakaxl.link',
		title: 'BakaXL Octo 章鱼网络',
		description: '接入 BakaXL Network 与 Octo 联机网络',
		iconUrl: 'https://avatars.githubusercontent.com/u/102580788?v=4',
	},
	{
		id: 'xjh2009.cloudflare.link',
		title: 'Cloudflare 联机',
		description: '通过临时 TCP 隧道连接局域网世界',
		iconUrl: 'https://avatars.githubusercontent.com/u/102580788?v=4',
	},
	{
		id: 'xjh2009.hysteria.link',
		title: 'Hysteria2 Realms 联机',
		description: '使用 UDP 打洞直连 Minecraft 世界',
		iconUrl: 'https://avatars.githubusercontent.com/u/102580788?v=4',
	},
	{
		id: 'xjh2009.resource-search-enhanced',
		title: '资源搜索增强',
		description: '增强 MCMOD 搜索与百科入口',
		iconUrl: 'https://avatars.githubusercontent.com/u/102580788?v=4',
	},
]

const plugins = ref<ShowcasePlugin[]>(fallbackPlugins)
const pluginSource = ref<'fallback' | 'nex-server'>('fallback')
const pluginIndexUpdatedAt = ref('')
let refreshTimer: ReturnType<typeof setInterval> | undefined

const normalizePlugin = (value: unknown): ShowcasePlugin | null => {
	if (!value || typeof value !== 'object') return null

	const plugin = value as Record<string, unknown>
	if (typeof plugin.id !== 'string' || typeof plugin.name !== 'string') {
		return null
	}

	return {
		id: plugin.id,
		title: plugin.name,
		description:
			typeof plugin.description === 'string' && plugin.description.length > 0
				? plugin.description
				: plugin.name,
		iconUrl:
			typeof plugin.logo === 'string' && plugin.logo.length > 0
				? plugin.logo
				: '/pcl-nex.png',
	}
}

const loadPluginIndex = async () => {
	try {
		const response = await fetch(`${PLUGIN_INDEX_URL}?t=${Date.now()}`, {
			cache: 'no-store',
		})
		if (!response.ok) return

		const payload = (await response.json()) as NexServerPluginIndex
		if (!Array.isArray(payload.plugins)) return

		const nextPlugins = payload.plugins
			.map(normalizePlugin)
			.filter((plugin): plugin is ShowcasePlugin => plugin !== null)
		if (nextPlugins.length === 0) return

		plugins.value = nextPlugins
		pluginSource.value = 'nex-server'
		pluginIndexUpdatedAt.value =
			typeof payload.updatedAt === 'string' ? payload.updatedAt : ''
	} catch {
		// 保留预渲染的回退列表，官网仍可在 GitHub Raw 不可用时完整展示。
	}
}

const rows = computed(() => {
	if (plugins.value.length === 0) return []

	const rowCount = 4
	const itemsPerRow = Math.max(8, plugins.value.length)
	return Array.from({ length: rowCount }, (_, rowIndex) =>
		Array.from(
			{ length: itemsPerRow },
			(_, itemIndex) =>
				plugins.value[
					(itemIndex + rowIndex * 2) % plugins.value.length
				] as ShowcasePlugin,
		),
	)
})

onMounted(() => {
	void loadPluginIndex()
	refreshTimer = setInterval(
		() => void loadPluginIndex(),
		PLUGIN_REFRESH_INTERVAL,
	)
})

onBeforeUnmount(() => {
	if (refreshTimer) clearInterval(refreshTimer)
})

const messages = defineMessages({
	title: {
		id: 'pcl-nex-marketing.features.plugin-market.title',
		defaultMessage: 'Features without the old limits',
	},
	description: {
		id: 'pcl-nex-marketing.features.plugin-market.description',
		defaultMessage:
			'Explore a growing marketplace of community plugins for themes, multiplayer, search, interface improvements, and more. Plugins extend PCL Nex beyond the feature boundaries of the original launcher.',
	},
})
</script>

<template>
	<div
		class="plugin-showcase"
		:data-plugin-source="pluginSource"
		:data-plugin-count="plugins.length"
		:data-index-updated-at="pluginIndexUpdatedAt"
	>
		<div v-for="(row, index) in rows" :key="index" class="plugin-row">
			<div
				v-for="n in 2"
				:key="n"
				class="plugin-row__content"
				:class="{ offset: index % 2 }"
			>
				<div
					v-for="(plugin, pluginIndex) in row"
					:key="`${plugin.id}-${pluginIndex}`"
					class="plugin-card"
					:aria-hidden="n === 2 ? 'true' : undefined"
				>
					<Avatar :src="plugin.iconUrl" alt="" size="sm" />
					<div class="plugin-info">
						<span class="title">{{ plugin.title }}</span>
						<span class="description">{{ plugin.description }}</span>
					</div>
				</div>
			</div>
		</div>
		<h3>{{ formatMessage(messages.title) }}</h3>
		<p>{{ formatMessage(messages.description) }}</p>
	</div>
</template>

<style lang="scss" scoped>
.plugin-showcase {
	margin: var(--gap-xl) 0;
	z-index: 3;
	text-align: left;

	.plugin-row {
		--gap: var(--gap-md);

		width: 100vw;
		margin-bottom: var(--gap);
		display: flex;
		overflow: hidden;
		user-select: none;

		&:hover {
			.plugin-row__content {
				animation-play-state: paused !important;
			}
		}

		.plugin-row__content {
			flex-shrink: 0;
			display: flex;
			width: max-content;
			gap: var(--gap);
			padding-right: var(--gap);
			animation: scroll 40s linear infinite;

			@media (prefers-reduced-motion: reduce) {
				animation-play-state: paused !important;
			}

			@keyframes scroll {
				from {
					transform: translateX(0);
				}

				to {
					transform: translateX(calc(-100%));
				}
			}

			&.offset {
				transform: translateX(-100%);
				animation: scroll-inverse 40s linear infinite;

				@keyframes scroll-inverse {
					from {
						transform: translateX(calc(-100%));
					}

					to {
						transform: translateX(0);
					}
				}
			}
		}

		.plugin-card {
			position: relative;
			display: flex;

			cursor: default;
			padding: 1rem;
			gap: 1rem;
			border-radius: 1rem;
			border: 1px solid var(--landing-border-color);
			transition:
				background 0.5s ease-in-out,
				transform 0.05s ease-in-out;
			// hover 位移在移动端卡顿，与 Modrinth 原版一致只保留背景渐变
			background: var(--landing-blob-gradient);
			user-select: none;

			&:hover {
				background: var(--landing-hover-card-gradient);
			}

			img {
				height: 3rem;
			}

			.plugin-info {
				box-sizing: border-box;
			}

			.title {
				color: var(--landing-color-heading);
				max-width: 13.75rem;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin: 0;
				font-weight: 600;
				font-size: 1.25rem;
				line-height: 110%;
				display: block;
			}

			.description {
				width: 13.75rem;

				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;

				font-weight: 500;
				font-size: 0.875rem;
				line-height: 125%;
				margin: 0.25rem 0 0;
			}
		}
	}

	h3 {
		font-weight: 500;
		font-size: var(--font-size-xl);
		color: var(--landing-color-heading);
		margin-bottom: 0.375rem;
		text-align: center;
	}

	p {
		font-size: var(--font-size-md);
		color: var(--landing-color-subheading);
		padding: var(--gap-xl);
		padding-top: 0;
		text-align: center;
	}
}

// 亮色模式项目卡背景（与页面其它卡片一致）
:global(html.light-mode) .plugin-card {
	background: rgba(255, 255, 255, 0.8) !important;
}
</style>
