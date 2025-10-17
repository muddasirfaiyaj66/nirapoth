"use client";

import {
  Camera,
  Zap,
  Users,
  Shield,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function Features() {
  const features = [
    {
      icon: Camera,
      title: "AI-Powered Detection",
      description:
        "Automatic detection of accidents, speeding, wrong-side driving, and traffic violations using advanced AI cameras.",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description:
        "Instant alerts to police and fire services when accidents are detected, ensuring rapid emergency response.",
    },
    {
      icon: Zap,
      title: "Automated Enforcement",
      description:
        "Digital cases filed automatically for violations. Vehicle owners can view and pay fines through their dashboard.",
    },
    {
      icon: Users,
      title: "Citizen Participation",
      description:
        "Report violations with photo/video evidence. Earn 5% rewards for valid reports, promoting community engagement.",
    },
    {
      icon: Shield,
      title: "Accountability System",
      description:
        "Driver gem system tracks violations. Excessive offenses lead to blacklisting, ensuring responsible driving.",
    },
    {
      icon: FileText,
      title: "Transparent Appeals",
      description:
        "Vehicle owners can dispute fines. Police review appeals to ensure fair and accurate enforcement.",
    },
  ];

  return (
    <section
      id="features"
      className="py-12 sm:py-16 md:py-24 bg-card dark:bg-transparent"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 sm:mb-16 text-center"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Comprehensive Road Safety Features
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-foreground/70 px-4 sm:px-0">
            A complete ecosystem for monitoring, enforcement, and citizen
            engagement
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group rounded-lg border border-border/50 bg-muted/30 p-5 sm:p-6 transition-all"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                variants={iconVariants}
                initial="idle"
                whileHover="hover"
              >
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-foreground/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
