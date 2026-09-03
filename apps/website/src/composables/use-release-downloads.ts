import type { DownloadSource } from './use-download-source'

export type ReleaseTarget =
	'win-x64' | 'win-arm64' | 'linux-x64' | 'osx-x64' | 'osx-arm64'
export type ReleaseChannelName = 'stable' | 'beta'

export interface ReleaseDownloadAsset {
	target: ReleaseTarget
	format: string
	file_name: string
	size: number | null
	sha256?: string
	downloads: Partial<Record<DownloadSource, string>>
}

export interface ReleaseChannel {
	tag: string
	version: string
	published_at: string
	prerelease: boolean
	release_url: string
	modelscope_url: string | null
	assets: ReleaseDownloadAsset[]
}

interface ReleaseManifest {
	schema_version: number
	channels: {
		stable?: ReleaseChannel
		beta?: ReleaseChannel
	}
}

type DownloadManifestState = 'idle' | 'loading' | 'ready' | 'error'
const RELEASE_CHANNEL_STORAGE_KEY = 'pcl-nex-release-channel'

function isReleaseManifest(value: unknown): value is ReleaseManifest {
	if (!value || typeof value !== 'object') return false
	const candidate = value as Partial<ReleaseManifest>
	return candidate.schema_version === 1 && !!candidate.channels
}

export function useReleaseDownloads() {
	const config = useRuntimeConfig()
	const manifest = useState<ReleaseManifest | null>(
		'pcl-nex-release-manifest',
		() => null,
	)
	const state = useState<DownloadManifestState>(
		'pcl-nex-release-manifest-state',
		() => 'idle',
	)
	const selectedChannel = useState<ReleaseChannelName>(
		'pcl-nex-release-channel',
		() => 'stable',
	)
	const resolvedChannel = computed<ReleaseChannelName>(() => {
		if (manifest.value?.channels[selectedChannel.value])
			return selectedChannel.value
		return manifest.value?.channels.stable ? 'stable' : 'beta'
	})
	const release = computed(
		() => manifest.value?.channels[resolvedChannel.value] ?? null,
	)
	const hasStableRelease = computed(() => !!manifest.value?.channels.stable)
	const hasBetaRelease = computed(() => !!manifest.value?.channels.beta)
	const hasModelScopeMirror = computed(
		() =>
			!!release.value?.modelscope_url &&
			release.value.assets.some((asset) => !!asset.downloads.modelscope),
	)

	async function loadManifest() {
		if (state.value === 'loading' || state.value === 'ready') return
		state.value = 'loading'
		try {
			const response = await fetch(config.public.releaseManifestUrl)
			if (!response.ok)
				throw new Error(`Release manifest returned ${response.status}`)
			const payload: unknown = await response.json()
			if (!isReleaseManifest(payload))
				throw new Error('Invalid release manifest')
			manifest.value = payload
			state.value = 'ready'
		} catch {
			state.value = 'error'
		}
	}

	function setReleaseChannel(channel: ReleaseChannelName) {
		selectedChannel.value = channel
		if (import.meta.client) {
			localStorage.setItem(RELEASE_CHANNEL_STORAGE_KEY, channel)
		}
	}

	function findAsset(target: ReleaseTarget, format: string) {
		return (
			release.value?.assets.find(
				(asset) => asset.target === target && asset.format === format,
			) ?? null
		)
	}

	function resolveDownload(
		target: ReleaseTarget,
		format: string,
		source: DownloadSource,
	) {
		const asset = findAsset(target, format)
		return asset?.downloads[source] ?? asset?.downloads.github ?? null
	}

	onMounted(() => {
		const stored = localStorage.getItem(RELEASE_CHANNEL_STORAGE_KEY)
		if (stored === 'stable' || stored === 'beta') {
			selectedChannel.value = stored
		}
		loadManifest()
	})

	return {
		state: readonly(state),
		release,
		resolvedChannel,
		hasStableRelease,
		hasBetaRelease,
		hasModelScopeMirror,
		findAsset,
		resolveDownload,
		setReleaseChannel,
		loadManifest,
	}
}
