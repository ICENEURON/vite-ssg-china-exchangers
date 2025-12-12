import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table'
import { Button } from "../../components/ui/button";

type HistoryPick = {
  code: string
  name: string
  score: string
  link: string
  thesis: string
}

type HistoryWeek = {
  id: string
  label: string
  dateRange: string
  marketContext?: string
  picks: HistoryPick[]
}

export default function HistoryPage() {
  const { t } = useTranslation('translation')

  const weeks = t('pages.history.weeks', {
    returnObjects: true,
  }) as HistoryWeek[]

  return (
    <>
      <Head>
        <title>{t('pages.history.title')}</title>
        <meta
          name="description"
          content={t('pages.history.meta.description')}
        />
        <meta
          name="keywords"
          content={t('pages.history.meta.keywords')}
        />
      </Head>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4">
            {t('pages.history.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-3">
            {t('pages.history.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Weeks + tables */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          {Array.isArray(weeks) &&
            weeks.map((week) => (
              <div
                key={week.id}
                className="space-y-3 flex flex-col lg:flex-row gap-4"
              >
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <h3>{week.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {week.dateRange}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-background">
                <Table className="min-w-full text-left text-sm table-fixed">
                  <colgroup>
                    <col className="w-[5%]" />
                    <col className="w-[25%]" />
                    <col className="w-[15%]" />
                    <col className="w-[10%]" />
                    <col className="w-[45%] hidden md:table-cell" />
                  </colgroup>
                  <TableHeader className="bg-muted/60">
                    <TableRow>
                      <TableHead className="px-4 py-3 font-medium">
                        {t('pages.history.table.columns.code')}
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium">
                        {t('pages.history.table.columns.name')}
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium">
                        {t('pages.history.table.columns.score')}
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium">
                        {t('pages.history.table.columns.link')}
                      </TableHead>
                      <TableHead className="px-4 py-3 font-medium hidden md:table-cell">
                        {t('pages.history.table.columns.thesis')}
                      </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(week.picks) && week.picks.length > 0 ? (
                        week.picks.map((pick) => (
                          <TableRow
                            key={pick.code}
                            className="last:border-b hover:bg-muted/40"
                          >
                            <TableCell className="px-4 py-3 font-mono text-xs md:text-sm">
                              {pick.code}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm">
                              {pick.name}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm">
                              {pick.score}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm">
                              <Button
                                  asChild
                                  size="sm"
                                  variant="destructive"
                                  className="whitespace-nowrap"
                                >
                                  <a
                                    href={`${pick.link}${pick.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View
                                  </a>
                                </Button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                              {pick.thesis}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                            colSpan={6}
                          >
                            {t('pages.history.table.emptyState')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}
