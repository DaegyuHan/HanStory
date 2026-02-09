import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create tags
  const tags = [
    { code: 'DEV_LOG', label: '개발일지', color: '#0ea5e9', sortOrder: 1 },
    { code: 'TODO', label: '할 일', color: '#f59e0b', sortOrder: 2 },
    { code: 'DEV_PLAN', label: '개발일정', color: '#10b981', sortOrder: 3 },
  ]

  for (const t of tags) {
    await prisma.tag.upsert({ where: { code: t.code }, update: {}, create: t })
  }

  // Create admin user
  const username = 'admin'
  const password = 'password'
  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash,
    },
  })

  // Create one sample entry for each tag for today (more descriptive)
  const user = await prisma.user.findUnique({ where: { username } })
  if (user) {
    const today = new Date()
    const sampleData: Record<string, { title: string; content: string }> = {
      DEV_LOG: {
        title: 'OAuth 로그인 리팩터링 완료 및 회고',
        content:
          'OAuth 로그인 흐름을 리팩터링했습니다. 리프레시 토큰 처리 개선, 에러 핸들링 강화, 관련 유닛 테스트 추가 예정입니다. 회고: 인증 실패 케이스를 좀 더 세분화할 필요가 있습니다.',
      },
      TODO: {
        title: '릴리스 전 체크리스트 검토',
        content: '배포 전 확인할 항목을 정리했습니다: 마이그레이션, env 확인, CDN 캐시 무효화, 모니터링/알림 점검, 백업 확인.',
      },
      DEV_PLAN: {
        title: '다음 주 스프린트: 태그 필터 개선 계획',
        content: '목표: 태그 검색 성능 및 UX 개선. 작업 항목: 인덱스 추가, 자동완성 구현, 클라이언트 캐싱 설계, 로드 테스트.',
      },
    }

    for (const t of tags) {
      const s = sampleData[t.code] || { title: `샘플 - ${t.label}`, content: `자동 생성된 샘플 게시물 (태그: ${t.label})` }
      await prisma.entry.create({
        data: {
          userId: user.id,
          date: today,
          tagCode: t.code,
          title: s.title,
          content: s.content,
        },
      })
    }
  }

  console.log('Seed finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
