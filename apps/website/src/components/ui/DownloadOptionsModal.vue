<script setup lang="ts">
import CheckIcon from '@modrinth/assets/icons/check.svg?component'
import DownloadIcon from '@modrinth/assets/icons/download.svg?component'
import XIcon from '@modrinth/assets/icons/x.svg?component'
import ButtonStyled from '@modrinth/ui/src/components/base/ButtonStyled.vue'
import { defineMessages, useVIntl } from '@modrinth/ui/src/composables/i18n.ts'

import type { DownloadSource } from '~/composables/use-download-source'
import type { ReleaseChannelName } from '~/composables/use-release-downloads'

const open = defineModel<boolean>({ required: true })
const channel = defineModel<ReleaseChannelName>('channel', { required: true })
const source = defineModel<DownloadSource>('source', { required: true })
defineProps<{
	hasStableRelease: boolean
	hasBetaRelease: boolean
	hasModelScopeMirror: boolean
}>()

const { formatMessage } = useVIntl()
const panel = ref<HTMLElement | null>(null)
let lastFocusedElement: HTMLElement | null = null

const messages = defineMessages({
	title: {
		id: 'pcl-nex-download-options.title',
		defaultMessage: 'Choose download options',
	},
	description: {
		id: 'pcl-nex-download-options.description',
		defaultMessage: 'Select a release channel and download source.',
	},
	close: {
		id: 'pcl-nex-download-options.close',
		defaultMessage: 'Close download options',
	},
	channel: {
		id: 'pcl-nex-marketing.download.channel',
		defaultMessage: 'Release channel',
	},
	stable: {
		id: 'pcl-nex-marketing.download.channel.stable',
		defaultMessage: 'Stable',
	},
	stableDescription: {
		id: 'pcl-nex-download-options.channel.stable-description',
		defaultMessage: 'Recommended for everyday use.',
	},
	beta: {
		id: 'pcl-nex-marketing.download.channel.beta',
		defaultMessage: 'Beta',
	},
	betaDescription: {
		id: 'pcl-nex-download-options.channel.beta-description',
		defaultMessage: 'Try the latest changes before the stable release.',
	},
	source: {
		id: 'pcl-nex-download-options.source',
		defaultMessage: 'Download source',
	},
	modelscope: {
		id: 'pcl-nex-marketing.download.source.modelscope',
		defaultMessage: 'ModelScope mirror',
	},
	modelscopeDescription: {
		id: 'pcl-nex-download-options.source.modelscope-description',
		defaultMessage: 'Faster access from mainland China.',
	},
	modelscopeUnavailable: {
		id: 'pcl-nex-marketing.download.source.modelscope-unavailable',
		defaultMessage: 'The current release is not mirrored to ModelScope yet',
	},
	github: {
		id: 'pcl-nex-marketing.download.source.github',
		defaultMessage: 'GitHub',
	},
	githubDescription: {
		id: 'pcl-nex-download-options.source.github-description',
		defaultMessage: 'Download the original GitHub Release assets.',
	},
	done: {
		id: 'pcl-nex-download-options.done',
		defaultMessage: 'Done',
	},
})

function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(
			'button, input, [href], [tabindex]:not([tabindex="-1"])',
		),
	).filter((element) => !element.hasAttribute('disabled'))
}

function handleKeyDown(event: KeyboardEvent) {
	if (!open.value) return
	if (event.key === 'Escape') {
		open.value = false
		return
	}
	if (event.key !== 'Tab' || !panel.value) return

	const focusable = getFocusableElements(panel.value)
	if (!focusable.length) return
	const first = focusable[0]
	const last = focusable[focusable.length - 1]

	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault()
		last.focus()
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault()
		first.focus()
	}
}

watch(open, (isOpen) => {
	if (!import.meta.client) return
	document.body.style.overflow = isOpen ? 'hidden' : ''
	if (isOpen) {
		lastFocusedElement = document.activeElement as HTMLElement | null
		nextTick(() => {
			if (!panel.value) return
			getFocusableElements(panel.value)[0]?.focus()
		})
	} else {
		lastFocusedElement?.focus()
		lastFocusedElement = null
	}
})

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => {
	document.body.style.overflow = ''
	window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
	<Teleport to="body">
		<Transition name="download-options-modal">
			<div
				v-if="open"
				class="download-options-backdrop"
				@click.self="open = false"
			>
				<section
					ref="panel"
					class="download-options-panel"
					role="dialog"
					aria-modal="true"
					aria-labelledby="download-options-title"
					aria-describedby="download-options-description"
				>
					<header>
						<div>
							<h2 id="download-options-title">
								<DownloadIcon aria-hidden="true" />
								{{ formatMessage(messages.title) }}
							</h2>
							<p id="download-options-description">
								{{ formatMessage(messages.description) }}
							</p>
						</div>
						<ButtonStyled circular type="transparent">
							<button
								:aria-label="formatMessage(messages.close)"
								@click="open = false"
							>
								<XIcon aria-hidden="true" />
							</button>
						</ButtonStyled>
					</header>

					<div class="download-options-body">
						<fieldset>
							<legend>{{ formatMessage(messages.channel) }}</legend>
							<div class="choice-list">
								<label v-if="hasStableRelease" class="choice-row">
									<input
										v-model="channel"
										class="choice-input"
										type="radio"
										name="release-channel"
										value="stable"
									/>
									<span class="choice-copy">
										<strong>{{ formatMessage(messages.stable) }}</strong>
										<span>{{ formatMessage(messages.stableDescription) }}</span>
									</span>
									<span class="choice-indicator" aria-hidden="true">
										<CheckIcon v-if="channel === 'stable'" />
									</span>
								</label>
								<label v-if="hasBetaRelease" class="choice-row">
									<input
										v-model="channel"
										class="choice-input"
										type="radio"
										name="release-channel"
										value="beta"
									/>
									<span class="choice-copy">
										<strong>{{ formatMessage(messages.beta) }}</strong>
										<span>{{ formatMessage(messages.betaDescription) }}</span>
									</span>
									<span class="choice-indicator" aria-hidden="true">
										<CheckIcon v-if="channel === 'beta'" />
									</span>
								</label>
							</div>
						</fieldset>

						<fieldset>
							<legend>{{ formatMessage(messages.source) }}</legend>
							<div class="choice-list">
								<label
									class="choice-row"
									:class="{ disabled: !hasModelScopeMirror }"
								>
									<input
										v-model="source"
										class="choice-input"
										type="radio"
										name="download-source"
										value="modelscope"
										:disabled="!hasModelScopeMirror"
									/>
									<span class="choice-copy">
										<strong>{{ formatMessage(messages.modelscope) }}</strong>
										<span>
											{{
												hasModelScopeMirror
													? formatMessage(messages.modelscopeDescription)
													: formatMessage(messages.modelscopeUnavailable)
											}}
										</span>
									</span>
									<span class="choice-indicator" aria-hidden="true">
										<CheckIcon v-if="source === 'modelscope'" />
									</span>
								</label>
								<label class="choice-row">
									<input
										v-model="source"
										class="choice-input"
										type="radio"
										name="download-source"
										value="github"
									/>
									<span class="choice-copy">
										<strong>{{ formatMessage(messages.github) }}</strong>
										<span>{{ formatMessage(messages.githubDescription) }}</span>
									</span>
									<span class="choice-indicator" aria-hidden="true">
										<CheckIcon v-if="source === 'github'" />
									</span>
								</label>
							</div>
						</fieldset>
					</div>

					<footer>
						<ButtonStyled color="brand">
							<button @click="open = false">
								{{ formatMessage(messages.done) }}
							</button>
						</ButtonStyled>
					</footer>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.download-options-backdrop {
	position: fixed;
	inset: 0;
	z-index: 110;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background: rgb(10 12 18 / 58%);
	backdrop-filter: blur(8px) saturate(90%);
}

.download-options-panel {
	display: flex;
	width: min(35rem, 100%);
	max-height: calc(100vh - 2rem);
	flex-direction: column;
	overflow: hidden;
	border: 1px solid var(--color-divider);
	border-radius: 0.75rem;
	background: var(--color-raised-bg);
	box-shadow: 0 2rem 6rem rgb(0 0 0 / 42%);

	header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.35rem 1.35rem 1.1rem;
		border-bottom: 1px solid var(--color-divider);

		h2 {
			display: flex;
			align-items: center;
			gap: 0.625rem;
			margin: 0;
			color: var(--color-contrast);
			font-size: 1.125rem;
			font-weight: 800;
		}

		p {
			margin: 0.35rem 0 0;
			color: var(--color-secondary);
			font-size: 0.875rem;
			line-height: 1.5;
		}

		svg {
			width: 1.125rem;
			height: 1.125rem;
		}
	}

	footer {
		display: flex;
		justify-content: flex-end;
		padding: 1rem 1.35rem;
		border-top: 1px solid var(--color-divider);
	}
}

.download-options-body {
	display: flex;
	min-height: 0;
	flex-direction: column;
	gap: 1.35rem;
	overflow-y: auto;
	padding: 1.25rem 1.35rem 1.35rem;

	fieldset {
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		margin-bottom: 0.55rem;
		color: var(--color-contrast);
		font-size: 0.85rem;
		font-weight: 750;
	}
}

.choice-list {
	display: grid;
	gap: 0.5rem;
}

.choice-row {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 1.25rem;
	align-items: center;
	gap: 1rem;
	min-height: 4.35rem;
	padding: 0.8rem 0.9rem;
	border: 1px solid var(--color-divider);
	border-radius: 0.5rem;
	background: var(--color-bg);
	cursor: pointer;
	transition:
		border-color 120ms ease,
		background-color 120ms ease;

	&:hover:not(.disabled) {
		border-color: color-mix(
			in srgb,
			var(--color-brand) 58%,
			var(--color-divider)
		);
	}

	&:has(.choice-input:checked) {
		border-color: var(--color-brand);
		background: var(--color-brand-highlight);
	}

	&:has(.choice-input:focus-visible) {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	&.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}

.choice-input {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.choice-copy {
	display: flex;
	min-width: 0;
	flex-direction: column;
	gap: 0.2rem;

	strong {
		color: var(--color-contrast);
		font-size: 0.9rem;
		font-weight: 700;
	}

	span {
		color: var(--color-secondary);
		font-size: 0.8rem;
		line-height: 1.4;
	}
}

.choice-indicator {
	display: grid;
	width: 1.25rem;
	height: 1.25rem;
	place-items: center;
	border: 1px solid var(--color-divider);
	border-radius: 50%;
	color: var(--color-brand-inverted);

	.choice-input:checked ~ & {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}

	svg {
		width: 0.75rem;
		height: 0.75rem;
	}
}

.download-options-modal-enter-active,
.download-options-modal-leave-active {
	transition: opacity 160ms ease;

	.download-options-panel {
		transition: transform 160ms ease;
	}
}

.download-options-modal-enter-from,
.download-options-modal-leave-to {
	opacity: 0;

	.download-options-panel {
		transform: translateY(0.5rem) scale(0.985);
	}
}

@media (max-width: 560px) {
	.download-options-backdrop {
		align-items: flex-end;
		padding: 0;
	}

	.download-options-panel {
		width: 100%;
		max-height: 92vh;
		border-radius: 0.75rem 0.75rem 0 0;
	}
}
</style>
