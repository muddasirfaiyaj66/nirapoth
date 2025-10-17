"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    x: 8,
    transition: { duration: 0.2 },
  },
};

const numberVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
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

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      delay: 0.4,
    },
  },
};

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "AI Detection",
      description:
        "Smart cameras continuously monitor roads for violations and accidents",
    },
    {
      number: "02",
      title: "Instant Alert",
      description:
        "System automatically notifies relevant authorities and files digital cases",
    },
    {
      number: "03",
      title: "Notification",
      description:
        "Vehicle owners receive notifications with case details and payment options",
    },
    {
      number: "04",
      title: "Resolution",
      description:
        "Pay fines online or submit appeals for review by local authorities",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-muted dark:bg-transparent py-12 sm:py-16 md:py-24"
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
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
            A seamless process from detection to resolution
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              variants={stepVariants}
              whileHover="hover"
            >
              <motion.div
                className="mb-3 sm:mb-4 text-4xl sm:text-5xl md:text-6xl font-bold text-primary/60"
                variants={numberVariants}
              >
                {step.number}
              </motion.div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-foreground/70">
                {step.description}
              </p>

              {/* Animated connecting line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute right-0 top-8 hidden h-0.5 w-full bg-gradient-to-r from-border to-transparent lg:block origin-left"
                  variants={lineVariants}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
