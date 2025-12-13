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
import { GitCommit, Tag } from 'lucide-react'

type ChangelogItem = {
  type: string
  description: string
  author: string
  link: string
  details: string
}

type VersionManufacturers = {
  id: string
  version: string
  date: string
  changes: ChangelogItem[]
}

export default function ManufacturersPage() {
  const { t } = useTranslation('translation')

  const versions = t('pages.manufacturers.versions', {
    returnObjects: true,
  }) as VersionManufacturers[]

  return (
    <>
      <Head>
        <title>{t('pages.manufacturers.title')}</title>
        <meta
          name="description"
          content={t('pages.manufacturers.meta.description')}
        />
        <meta
          name="keywords"
          content={t('pages.manufacturers.meta.keywords')}
        />
      </Head>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4">
            {t('pages.manufacturers.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-3">
            {t('pages.manufacturers.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Versions + tables */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          {Array.isArray(versions) &&
            versions.map((version) => (
              <div
                key={version.id}
                className="space-y-3 flex flex-col lg:flex-row gap-4"
              >
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-lg">{version.version}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {version.date}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-background flex-1">
                  <Table className="min-w-full text-left text-sm table-fixed">
                    <colgroup>
                      <col className="w-[10%]" />
                      <col className="w-[30%]" />
                      <col className="w-[10%]" />
                      <col className="w-[10%]" />
                      <col className="w-[40%] hidden md:table-cell" />
                    </colgroup>
                    <TableHeader className="bg-muted/60">
                      <TableRow>
                        <TableHead className="px-4 py-3 font-medium">
                          {t('pages.manufacturers.table.columns.type')}
                        </TableHead>
                        <TableHead className="px-4 py-3 font-medium">
                          {t('pages.manufacturers.table.columns.description')}
                        </TableHead>
                        <TableHead className="px-4 py-3 font-medium">
                          {t('pages.manufacturers.table.columns.author')}
                        </TableHead>
                        <TableHead className="px-4 py-3 font-medium">
                          {t('pages.manufacturers.table.columns.link')}
                        </TableHead>
                        <TableHead className="px-4 py-3 font-medium hidden md:table-cell">
                          {t('pages.manufacturers.table.columns.details')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(version.changes) && version.changes.length > 0 ? (
                        version.changes.map((change, idx) => (
                          <TableRow
                            key={idx}
                            className="last:border-b hover:bg-muted/40"
                          >
                            <TableCell className="px-4 py-3 font-mono text-xs md:text-sm">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${change.type === 'feat' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' :
                                change.type === 'fix' ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                {change.type}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm font-semibold">
                              {change.description}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm text-muted-foreground">
                              {change.author}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs md:text-sm">
                              <Button
                                asChild
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <a
                                  href={change.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View Commit"
                                >
                                  <GitCommit className="h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                              {change.details}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                            colSpan={5}
                          >
                            {t('pages.manufacturers.table.emptyState')}
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
