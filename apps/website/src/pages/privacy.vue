<script setup lang="ts">
import { useVIntl } from '@modrinth/ui/src/composables/i18n.ts'

import LegalDocument from '~/components/ui/LegalDocument.vue'

const { locale } = useVIntl()
const isChinese = computed(() => locale.value === 'zh-CN')
const siteUrl = useRuntimeConfig().public.siteUrl
const canonicalUrl = `${siteUrl}/privacy`

const seoTitle = computed(() =>
	isChinese.value ? '隐私政策 - PCL Nex' : 'Privacy Policy - PCL Nex',
)
const seoDescription = computed(() =>
	isChinese.value
		? '了解 PCL Nex 官网如何在浏览器中保存偏好并连接第三方服务。'
		: 'Learn how the PCL Nex website stores browser preferences and connects to third parties.',
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
		eyebrow="隐私政策"
		title="隐私政策"
		description="本政策说明 PCL Nex 官网处理浏览器偏好和第三方请求的方式。"
		updated-at="2026 年 8 月 30 日"
	>
		<h2>1. 本地保存的数据</h2>
		<p>
			官网无需注册账户。浏览器会在本地保存语言、主题、动态效果和外部链接打开方式等偏好。它们通过
			Cookie 或 localStorage 保存在你的设备中，可随时通过浏览器设置清除。
		</p>

		<h2>2. 网站请求</h2>
		<p>
			网站本身不设置广告
			Cookie，也不包含第三方问卷或行为分析脚本。托管服务仍可能为提供访问、安全防护和故障排查处理
			IP 地址、访问时间、请求路径、User-Agent
			与错误日志，具体以托管服务商政策为准。
		</p>

		<h2>3. 第三方内容</h2>
		<p>
			打开 GitHub 下载、问题、社区链接，或加载 Modrinth
			项目图标时，你的浏览器会直接向对应第三方发送网络请求。第三方可能收到 IP
			地址、User-Agent、来源页面及完成请求所需的信息，并按其隐私政策处理。
		</p>

		<h2>4. 启动器数据</h2>
		<p>
			本页面只描述官网。PCL Nex
			启动器在本地处理账户、实例、日志、下载与设置等运行数据，并会在你主动使用登录、下载、更新或联机功能时连接相应服务。请在提交
			Issue 前删除令牌、账户信息和其他敏感内容。
		</p>

		<h2>5. 联系</h2>
		<p>
			隐私或安全问题可通过
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/issues"
				target="_blank"
				rel="noopener"
				>GitHub Issues</a
			>
			联系维护者。不要在公开 Issue 中提交密码、令牌或完整私人日志。
		</p>
	</LegalDocument>

	<LegalDocument
		v-else
		:key="`en-${locale}`"
		eyebrow="Privacy Policy"
		title="Privacy Policy"
		description="This policy explains how the PCL Nex website handles browser preferences and third-party requests."
		updated-at="August 30, 2026"
	>
		<h2>1. Data Stored Locally</h2>
		<p>
			The website requires no account. Your browser locally stores preferences
			such as language, theme, motion effects, and external-link behavior in
			cookies or localStorage. You can clear them through browser settings.
		</p>

		<h2>2. Website Requests</h2>
		<p>
			The site sets no advertising cookies and includes no third-party survey or
			behavioral-analytics script. Hosting providers may still process IP
			addresses, access times, request paths, User-Agent strings, and error logs
			to provide access, security, and troubleshooting under their own policies.
		</p>

		<h2>3. Third-Party Content</h2>
		<p>
			When you open GitHub downloads, issues, community links, or load Modrinth
			project icons, your browser requests those third parties directly. They
			may receive your IP address, User-Agent, referring page, and information
			required to complete the request, subject to their privacy policies.
		</p>

		<h2>4. Launcher Data</h2>
		<p>
			This page covers only the website. The PCL Nex launcher processes account,
			instance, log, download, and settings data locally, and connects to
			relevant services when you use sign-in, download, update, or multiplayer
			features. Remove tokens, account details, and other sensitive content
			before filing an issue.
		</p>

		<h2>5. Contact</h2>
		<p>
			For privacy or security questions, contact maintainers through
			<a
				href="https://github.com/PCL-Nex-Developer/PCL2-Nex/issues"
				target="_blank"
				rel="noopener"
				>GitHub Issues</a
			>. Do not post passwords, tokens, or complete private logs in public
			issues.
		</p>
	</LegalDocument>
</template>
