"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { ThreeDAccidentScene } from "./three-d-accident-scene";
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

const itemVariants = {
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

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-20 bg-white bg-opacity-20 dark:bg-transparent">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Badge with fade-in animation */}
          <motion.div
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-primary cursor-pointer"
            variants={badgeVariants}
            whileHover="hover"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
            <span className="whitespace-nowrap">
              AI-Powered Road Safety Platform
            </span>
          </motion.div>

          {/* Headline with staggered animation */}
          <motion.h1
            className="mb-4 sm:mb-6 text-balance text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground"
            variants={itemVariants}
          >
            Making Roads Safer Through{" "}
            <motion.span
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["0%", "100%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Technology
            </motion.span>{" "}
            and{" "}
            <motion.span
              className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["100%", "0%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Transparency
            </motion.span>
          </motion.h1>

          {/* Subtitle with fade-in animation */}
          <motion.p
            className="mb-6 sm:mb-10 text-pretty text-base sm:text-lg md:text-xl text-foreground/70 px-2 sm:px-0"
            variants={itemVariants}
          >
            NiraPoth combines AI-powered monitoring, citizen participation, and
            digital enforcement to create safer roads for everyone. Real-time
            accident detection, automated violation tracking, and transparent
            accountability.
          </motion.p>

          {/* CTA Buttons with scale animation */}
          <motion.div
            className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0"
            variants={itemVariants}
          >
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto hover:bg-primary/5 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* 3D Accident Detection Scene */}
          <motion.div
            className="mt-10 sm:mt-16 px-2 sm:px-0"
            variants={scaleVariants}
          >
            <ThreeDAccidentScene />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
