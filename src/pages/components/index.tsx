import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/ui/accordion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../../components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { BadgeCheckIcon, Heart, MessageSquare, Share2 } from "lucide-react"

export default function ComponentsPage() {
  const { t } = useTranslation('translation')

  return (
    <>
      <Head>
        <title>Components - {t('pages.home.title')}</title>
        <meta name="description" content="UI Components showcase and documentation" />
        <meta name="keywords" content="components, UI, React, Shadcn" />
      </Head>
      
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Components
          </h1>
          <p className="text-xl text-muted-foreground">
            UI Components showcase and documentation
          </p>
        </div>
        
        <div className="mx-auto space-y-16">
          {/* Badge Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Badge Components</h2>
              <p className="text-muted-foreground">
                Display labels, status indicators, and small pieces of information.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Basic Badges */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h1 className="mb-6">Basic Variants</h1>
                <div className="flex flex-wrap gap-3">
                  <Badge>Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
              
              {/* Special Badges */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="mb-6">With Icons & Numbers</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600"
                  >
                    <BadgeCheckIcon />
                    Verified
                  </Badge>
                  <Badge className="rounded-full">
                    8
                  </Badge>
                  <Badge
                    className="rounded-full"
                    variant="destructive"
                  >
                    99
                  </Badge>
                  <Badge
                    className="rounded-full"
                    variant="outline"
                  >
                    20+
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Accordion Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Accordion Components</h2>
              <p className="text-muted-foreground">
                Collapsible content areas for organizing information in a compact way.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Single Accordion */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Single Selection</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is React?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What is Vite?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts: a dev server and a build command.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What is TailwindCSS?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        TailwindCSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Multiple Accordion */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Multiple Selection</h3>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="features">
                    <AccordionTrigger>Key Features</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        <p>• TypeScript support out of the box</p>
                        <p>• Lightning-fast HMR with Vite</p>
                        <p>• Pre-configured Shadcn UI components</p>
                        <p>• Responsive design with TailwindCSS</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="benefits">
                    <AccordionTrigger>Benefits</AccordionTrigger>
                    <AccordionContent>
                        <p>• Faster development workflow</p>
                        <p>• Better code organization</p>
                        <p>• Consistent UI components</p>
                        <p>• Excellent developer experience</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="usage">
                    <AccordionTrigger>Usage Examples</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-muted-foreground">
                        <p>• FAQ sections</p>
                        <p>• Feature descriptions</p>
                        <p>• Documentation navigation</p>
                        <p>• Settings panels</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          {/* Card Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Card Components</h2>
              <p className="text-muted-foreground">
                Flexible containers for grouping and organizing content.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Basic Card */}
              <div className="p-8 border rounded-xl bg-background shadow-2xl">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Basic Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>
                        This is a basic card with a title and description.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Card content goes here. You can add any content like text, images, or other components.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Card</CardTitle>
                      <CardDescription>
                        A card showcasing a product feature.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">✓ Fast performance</p>
                        <p className="text-sm">✓ Easy to use</p>
                        <p className="text-sm">✓ Highly customizable</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm">Learn More</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Blog Post</CardTitle>
                      <CardAction>
                        <Badge variant="default">New</Badge>
                      </CardAction>
                      <CardDescription>
                        Latest updates from our team
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm">Read More</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              {/* Interactive Cards */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Interactive Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="border-b">
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email Notifications</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dark Mode</span>
                          <Badge variant="outline">Auto</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Language</span>
                          <Badge variant="outline">English</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t">
                      <Button className="w-full">Save Changes</Button>
                    </CardFooter>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="border-b">
                      <CardTitle>Statistics</CardTitle>
                      <CardAction>
                        <Badge>Live</Badge>
                      </CardAction>
                      <CardDescription>
                        Your performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Views</span>
                          <span className="font-mono text-sm">12,435</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Unique Visitors</span>
                          <span className="font-mono text-sm">8,291</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bounce Rate</span>
                          <span className="font-mono text-sm">24.5%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Carousel Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Carousel Components</h2>
              <p className="text-muted-foreground">
                Interactive slideshows for cycling through elements like images or cards.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Basic Carousel */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Basic Carousel</h3>
                <div className="flex justify-center">
                  <Carousel>
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>

              {/* Content Carousel */}
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Content Carousel</h3>
                <div className="flex justify-center">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {[
                        { title: "Welcome", content: "Get started with our amazing components", color: "bg-blue-100 dark:bg-blue-900" },
                        { title: "Features", content: "Explore powerful features and capabilities", color: "bg-green-100 dark:bg-green-900" },
                        { title: "Customizable", content: "Fully customizable to match your design", color: "bg-purple-100 dark:bg-purple-900" },
                        { title: "Responsive", content: "Works perfectly on all screen sizes", color: "bg-orange-100 dark:bg-orange-900" },
                      ].map((item, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className={item.color}>
                              <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
                                <h4 className="text-2xl font-semibold mb-4">{item.title}</h4>
                                <p className="text-muted-foreground">{item.content}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>

              {/* Multiple Items Carousel */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Multiple Items</h3>
                <div className="flex justify-center">
                  <Carousel className="w-full">
                    <CarouselContent className="ml-2 md:ml-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-4">
                                <div className="text-center">
                                  <div className="text-md font-semibold mb-2">Item {index + 1}</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Tabs Components</h2>
              <p className="text-muted-foreground">
                Organize content into separate views that users can switch between.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Basic Tabs */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Basic Tabs</h3>
                <div className="flex justify-center">
                  <div className="w-full">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>
                              General information and key metrics for your dashboard.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Total Users</span>
                                <Badge variant="outline">2,345</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Active Sessions</span>
                                <Badge variant="outline">156</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Revenue</span>
                                <Badge variant="outline">$12,345</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="analytics" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>
                              Detailed analytics and performance metrics.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Page Views</span>
                                <Badge>45,678</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Bounce Rate</span>
                                <Badge variant="destructive">23.4%</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Avg. Session</span>
                                <Badge variant="secondary">3m 42s</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="reports" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Reports</CardTitle>
                            <CardDescription>
                              Generate and download various reports.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Report</span>
                                <Button size="sm" variant="outline">Download</Button>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">User Activity</span>
                                <Button size="sm" variant="outline">Download</Button>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Sales Report</span>
                                <Button size="sm" variant="outline">Download</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Content Navigation</h3>
                <div className="flex justify-center">
                  <div className="w-full">
                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="support">Support</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                      </TabsList>
                      <TabsContent value="features" className="mt-6">
                        <div className="text-center space-y-4">
                          <h4 className="text-xl font-semibold">Amazing Features</h4>
                          <p className="text-muted-foreground">
                            Discover all the powerful features that make our platform unique.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded">
                              <h5 className="font-medium mb-2">Fast Performance</h5>
                              <p className="text-sm text-muted-foreground">Lightning fast load times</p>
                            </div>
                            <div className="p-4 border rounded">
                              <h5 className="font-medium mb-2">Easy Integration</h5>
                              <p className="text-sm text-muted-foreground">Simple setup process</p>
                            </div>
                            <div className="p-4 border rounded">
                              <h5 className="font-medium mb-2">24/7 Support</h5>
                              <p className="text-sm text-muted-foreground">Always here to help</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="pricing" className="mt-6">
                        <div className="text-center space-y-4">
                          <h4 className="text-xl font-semibold">Simple Pricing</h4>
                          <p className="text-muted-foreground">
                            Choose the plan that works best for you.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Starter</CardTitle>
                                <CardDescription>Perfect for individuals</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold">$9/mo</div>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full">Get Started</Button>
                              </CardFooter>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle>Pro</CardTitle>
                                <CardDescription>For growing teams</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold">$29/mo</div>
                              </CardContent>
                              <CardFooter>
                                <Button className="w-full">Get Started</Button>
                              </CardFooter>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="support" className="mt-6">
                        <div className="text-center space-y-4">
                          <h4 className="text-xl font-semibold">Get Support</h4>
                          <p className="text-muted-foreground">
                            We're here to help you succeed.
                          </p>
                          <div className="space-y-4">
                            <Button className="w-full" variant="outline">
                              📧 Email Support
                            </Button>
                            <Button className="w-full" variant="outline">
                              💬 Live Chat
                            </Button>
                            <Button className="w-full" variant="outline">
                              📚 Documentation
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="about" className="mt-6">
                        <div className="text-center space-y-4">
                          <h4 className="text-xl font-semibold">About Us</h4>
                          <p className="text-muted-foreground">
                            Learn more about our company and mission.
                          </p>
                          <div className="space-y-4 text-sm text-muted-foreground mx-auto">
                            <p>
                              We're passionate about creating tools that help developers build better applications faster.
                            </p>
                            <p>
                              Our team consists of experienced engineers and designers who understand the challenges of modern web development.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Table Component Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Table Components</h2>
              <p className="text-muted-foreground">
                Display structured data in rows and columns with sorting and filtering capabilities.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Invoice Table */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Invoice Table</h3>
                <div className="w-full">
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
                        { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
                        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
                        { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
                        { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
                        { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
                        { invoice: "INV007", paymentStatus: "Unpaid", totalAmount: "$300.00", paymentMethod: "Credit Card" },
                      ].map((invoice) => (
                        <TableRow key={invoice.invoice}>
                          <TableCell className="font-medium">{invoice.invoice}</TableCell>
                          <TableCell>
                            <Badge variant={
                              invoice.paymentStatus === "Paid" ? "default" :
                              invoice.paymentStatus === "Pending" ? "secondary" : "destructive"
                            }>
                              {invoice.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{invoice.paymentMethod}</TableCell>
                          <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>

              {/* User Table */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>User Management</h3>
                <div className="w-full">
                  <Table>
                    <TableCaption>Active users in your system.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
                        { name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
                        { name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
                        { name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active" },
                        { name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "Pending" },
                      ].map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.status === "Active" ? "default" :
                              user.status === "Pending" ? "secondary" : "destructive"
                            }>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Delete</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Product Table */}
              <div className="p-8 border rounded-xl bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ fontSize: 'var(--font-size-l)', fontWeight: 'var(--font-weight-semibold)' }}>Product Inventory</h3>
                <div className="w-full">
                  <Table>
                    <TableCaption>Current product inventory status.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Availability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { product: "Laptop Pro", category: "Electronics", stock: 45, price: "$1,299.00", available: true },
                        { product: "Wireless Mouse", category: "Accessories", stock: 120, price: "$29.99", available: true },
                        { product: "Monitor 4K", category: "Electronics", stock: 8, price: "$399.00", available: true },
                        { product: "Keyboard RGB", category: "Accessories", stock: 0, price: "$79.99", available: false },
                        { product: "Webcam HD", category: "Electronics", stock: 25, price: "$89.99", available: true },
                      ].map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.product}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={product.stock > 20 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{product.price}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={product.available ? "default" : "destructive"}>
                              {product.available ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2}>Total Products</TableCell>
                        <TableCell className="text-center">198</TableCell>
                        <TableCell colSpan={2} className="text-right">Total Value: $8,497.95</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    </>
  )
}