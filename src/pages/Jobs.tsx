import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Briefcase, FileText } from 'lucide-react';

const jobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        date: '2026-03-10',
        type: 'Full-time',
        location: 'Remote',
        experience: '3-5 Years',
        description: 'We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks to lead our web application development. You will be responsible for creating responsive, fast, and accessible user interfaces that provide an exceptional experience for our users.',
    },
    {
        id: 2,
        title: 'Backend Engineer (Node.js)',
        date: '2026-03-12',
        type: 'Full-time',
        location: 'Bangalore, India',
        experience: '2-4 Years',
        description: 'Join our backend team to build scalable APIs using Node.js, Express, and MySQL. Experience with microservices architecture is a plus. You will work closely with frontend developers and product managers to define API contracts and implement business logic securely.',
    },
    {
        id: 3,
        title: 'HR Manager',
        date: '2026-03-05',
        type: 'Full-time',
        location: 'Mumbai, India',
        experience: '5+ Years',
        description: 'Seeking a dynamic HR Manager to handle recruitment, employee relations, and organizational development for our growing team. You will be responsible for creating an inclusive workplace and managing the entire employee lifecycle from onboarding to offboarding.',
    },
    {
        id: 4,
        title: 'UI/UX Designer',
        date: '2026-03-13',
        type: 'Contract',
        location: 'Remote',
        experience: '1-3 Years',
        description: 'Looking for a creative UI/UX designer to craft intuitive and beautiful user experiences for our enterprise consultancy CRM products. You should be proficient in Figma, understanding user journeys, and creating responsive designs that look modern and premium.',
    }
];

export default function Jobs() {
    const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
    const navigate = useNavigate();

    const handleApply = (job: typeof jobs[0]) => {
        navigate('/apply-job', { state: { job } });
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-background">
            <div className="container px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-heading font-bold tracking-tight sm:text-5xl gradient-text mb-4">
                            Explore Opportunities
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                            Join our team of passionate professionals building the next generation of enterprise software solutions. Find a job that matches your skills.
                        </p>
                    </motion.div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden group cursor-pointer"
                                onClick={() => setSelectedJob(job)}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                            {job.type}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            Posted: {job.date}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-4 mt-2.5 text-sm">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
                                            {job.experience}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow pb-6">
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                        {job.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 mt-auto">
                                    <Button
                                        className="w-full gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents card click from opening dialog, instead just open dialog via button as well
                                            setSelectedJob(job);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {jobs.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-foreground">No open positions at the moment.</h3>
                        <p className="text-muted-foreground mt-2">Please check back later for new opportunities.</p>
                    </div>
                )}

                {/* Job Details Popup */}
                <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                    <DialogContent className="sm:max-w-[600px] border-border/50 bg-card/95 backdrop-blur-xl">
                        {selectedJob && (
                            <>
                                <DialogHeader className="mb-2">
                                    <div className="flex justify-between items-start mb-4 pr-6">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                            {selectedJob.type}
                                        </Badge>
                                        <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            Posted: {selectedJob.date}
                                        </div>
                                    </div>
                                    <DialogTitle className="text-2xl font-heading mb-2">{selectedJob.title}</DialogTitle>
                                    <DialogDescription className="text-base text-foreground mt-2 border-b border-border/50 pb-6 flex flex-wrap gap-4">
                                        <span className="flex items-center font-medium">
                                            <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                                            {selectedJob.location}
                                        </span>
                                        <span className="flex items-center font-medium">
                                            <Briefcase className="w-4 h-4 mr-1.5 text-primary" />
                                            {selectedJob.experience}
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <h4 className="font-semibold mb-3 flex items-center text-lg">
                                        <FileText className="w-5 h-5 mr-2 text-primary" />
                                        Job Description
                                    </h4>
                                    <div className="text-muted-foreground leading-relaxed space-y-4">
                                        <p>{selectedJob.description}</p>

                                        <div>
                                            <strong className="text-foreground">Key Responsibilities:</strong>
                                            <ul className="list-disc pl-5 mt-2 space-y-1.5">
                                                <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                                                <li>Ensure code quality, organization, and automation within the project.</li>
                                                <li>Identify and correct bottlenecks, fix bugs, and improve application performance.</li>
                                                <li>Continuously discover, evaluate, and implement new technologies.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <strong className="text-foreground">Requirements & Qualifications:</strong>
                                            <ul className="list-disc pl-5 mt-2 space-y-1.5">
                                                <li>Proven experience in the relevant technology stack and domain.</li>
                                                <li>Strong communication, teamwork, and problem-solving skills.</li>
                                                <li>Ability to adapt to a fast-paced, dynamic work environment.</li>
                                                <li>Bachelor degree in Computer Science, Design, or related field (or equivalent experience).</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="mt-4 sm:justify-between border-t border-border/50 pt-6">
                                    <Button variant="outline" onClick={() => setSelectedJob(null)}>
                                        Close
                                    </Button>
                                    <Button
                                        className="gradient-hero text-primary-foreground border-0 px-8 shadow-md hover:shadow-lg transition-shadow"
                                        onClick={() => handleApply(selectedJob)}
                                    >
                                        Apply for this Position
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
