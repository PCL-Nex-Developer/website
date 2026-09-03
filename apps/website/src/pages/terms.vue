<script setup lang="ts">
import { useVIntl } from '@modrinth/ui/src/composables/i18n.ts'

import LegalDocument from '~/components/ui/LegalDocument.vue'

const { locale } = useVIntl()
const isChinese = computed(() => locale.value === 'zh-CN')
const siteUrl = useRuntimeConfig().public.siteUrl
const canonicalUrl = `${siteUrl}/terms`

const seoTitle = computed(() =>
	isChinese.value
		? '授权与使用说明 - PCL Nex'
		: 'Licensing and Usage - PCL Nex',
)
const seoDescription = computed(() =>
	isChinese.value
		? '了解 PCL Nex 启动器与官网源码适用的授权及使用说明。'
		: 'Learn which licenses and usage terms apply to PCL Nex and this website.',
)

useSeoMeta({
	title: () => seoTitle.value,
	description: () => seoDescription.value,
	ogTitle: () => seoTitle.value,
	ogDescription: () => seoDescription.value,
	ogType: 'website',
	ogUrl: canonicalUrl,
	robots: 'index, follow',
})

useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] })
</script>

<template>
	<LegalDocument
		v-if="isChinese"
		:key="`zh-${locale}`"
		eyebrow="授权说明"
		title="授权与使用说明"
		description="本页面概述 PCL Nex 启动器、官网源码与第三方内容的授权边界；仓库中的原始许可证和声明具有优先效力。"
		updated-at="2026 年 8 月 30 日"
	>
		<h2>1. 项目关系</h2>
		<p>
			PCL Nex 是基于 Plain Craft
			Launcher（PCL）代码独立开发的社区版本，包含主线暂未制作的功能和改进。社区版版本号与主线并非严格对应，请将
			PCL Nex 的问题提交到 PCL Nex 仓库。
		</p>

		<h2>2. 启动器源码</h2>
		<p>
			<code>Plain Craft Launcher 2/</code> 目录遵循仓库中的
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/blob/dev/Plain%20Craft%20Launcher%202/LICENCE"
				target="_blank"
				rel="noopener"
				>PCL 自定义授权指南</a
			>；仓库其余目录采用
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/blob/dev/LICENSE"
				target="_blank"
				rel="noopener"
				>Apache License 2.0</a
			>，除非文件另有声明。复制、修改或分发前，请直接阅读对应目录中的完整文本。
		</p>

		<h2>3. 官网源码</h2>
		<p>
			官网以 Axolotl Launcher
			官方网站源码为基础，所导入的网站与共享组件保留上游的 AGPL-3.0-only
			许可证、复制说明和各自的第三方声明。AGPL
			对修改、分发和网络部署的具体要求以
			<a
				href="https://github.com/Mystic-Stars/Axolotl/blob/main/apps/website/LICENSE"
				target="_blank"
				rel="noopener"
				>许可证原文</a
			>为准。
		</p>

		<h2>4. 第三方服务与品牌</h2>
		<p>
			启动器会根据你的操作连接
			Microsoft、Minecraft、Modrinth、CurseForge、GitHub、自定义认证服务和内容作者的下载地址。这些服务与内容适用各自的条款、隐私政策和许可证。
		</p>
		<p>
			PCL Nex 不是 Mojang 或 Microsoft
			的官方服务，也未获得其批准或背书。Minecraft
			及其他第三方名称、标志和素材归各自权利人所有。
		</p>

		<h2>5. 无担保与责任</h2>
		<p>
			项目按现状提供。跨平台版本仍处于内测阶段；请备份重要数据并从官方发布页下载。除适用法律另有要求外，维护者不对使用或无法使用项目造成的间接、附带或后果性损失承担责任。
		</p>

		<h2>6. 联系</h2>
		<p>
			授权或使用问题可通过
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/issues"
				target="_blank"
				rel="noopener"
				>GitHub Issues</a
			>
			联系维护者，或加入 PCL Nex QQ 群 523291985。本页面不构成法律意见。
		</p>
	</LegalDocument>

	<LegalDocument
		v-else
		:key="`en-${locale}`"
		eyebrow="Licensing"
		title="Licensing and Usage"
		description="This page summarizes the licensing boundaries of PCL Nex, this website, and third-party content. Original repository licenses and notices take precedence."
		updated-at="August 30, 2026"
	>
		<h2>1. Project Relationship</h2>
		<p>
			PCL Nex is an independently developed community edition based on Plain
			Craft Launcher (PCL), with features and improvements not yet present in
			mainline PCL. Version numbers do not map directly; report PCL Nex issues
			to the PCL Nex repository.
		</p>

		<h2>2. Launcher Source</h2>
		<p>
			The <code>Plain Craft Launcher 2/</code> directory follows the
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/blob/dev/Plain%20Craft%20Launcher%202/LICENCE"
				target="_blank"
				rel="noopener"
				>PCL custom licensing guide</a
			>. The rest of the repository uses
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/blob/dev/LICENSE"
				target="_blank"
				rel="noopener"
				>Apache License 2.0</a
			>
			unless a file says otherwise. Read the complete text before copying,
			modifying, or distributing code.
		</p>

		<h2>3. Website Source</h2>
		<p>
			This website is based on the official Axolotl Launcher website. Imported
			website and shared-component sources retain their AGPL-3.0-only licenses,
			copying notices, and third-party declarations. Refer to the retained
			license text for modification, distribution, and network-use requirements.
		</p>

		<h2>4. Third-Party Services and Brands</h2>
		<p>
			Based on your actions, the launcher may connect to Microsoft, Minecraft,
			Modrinth, CurseForge, GitHub, custom authentication services, and
			content-author download servers. Their own terms, privacy policies, and
			licenses apply.
		</p>
		<p>
			PCL Nex is not an official Mojang or Microsoft service and is not approved
			or endorsed by them. Minecraft and other third-party names, marks, and
			assets belong to their respective owners.
		</p>

		<h2>5. No Warranty and Liability</h2>
		<p>
			The project is provided as is. Cross-platform builds are still in testing;
			back up important data and download only from official releases. Except
			where applicable law requires otherwise, maintainers are not liable for
			indirect, incidental, or consequential loss caused by use or inability to
			use the project.
		</p>

		<h2>6. Contact</h2>
		<p>
			For licensing or usage questions, contact maintainers through
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/issues"
				target="_blank"
				rel="noopener"
				>GitHub Issues</a
			>
			or join QQ group 523291985. This page is not legal advice.
		</p>
	</LegalDocument>
</template>
