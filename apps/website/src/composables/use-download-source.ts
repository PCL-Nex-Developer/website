export type DownloadSource = 'modelscope' | 'github'
export type ResolvedDownloadSource = DownloadSource

const DOWNLOAD_SOURCE_STORAGE_KEY = 'pcl-nex-download-source'

export function useDownloadSource() {
	const selectedSource = useState<DownloadSource>(
		'pcl-nex-download-source',
		() => 'modelscope',
	)
	const resolvedSource = computed<ResolvedDownloadSource>(
		() => selectedSource.value,
	)

	function setDownloadSource(source: DownloadSource) {
		selectedSource.value = source
		if (import.meta.client) {
			localStorage.setItem(DOWNLOAD_SOURCE_STORAGE_KEY, source)
		}
	}

	onMounted(() => {
		const stored = localStorage.getItem(DOWNLOAD_SOURCE_STORAGE_KEY)
		if (stored === 'github' || stored === 'modelscope') {
			selectedSource.value = stored
		}
	})

	return {
		selectedSource,
		resolvedSource,
		setDownloadSource,
	}
}
