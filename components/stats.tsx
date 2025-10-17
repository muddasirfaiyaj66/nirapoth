"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
  },
};

const hoverVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 },
  },
};

export function Stats() {
  const stats = [
    { value: "24/7", label: "AI Monitoring", color: "text-primary" },
    { value: "< 2min", label: "Emergency Response", color: "text-accent" },
    { value: "100%", label: "Transparency", color: "text-primary" },
    { value: "5%", label: "Citizen Rewards", color: "text-accent" },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="border-y border-border/50 bg-card dark:bg-transparent py-10 sm:py-12 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              variants={itemVariants}
            >
              <motion.div
                className={`mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl font-bold ${stat.color}`}
                variants={hoverVariants}
                whileHover="hover"
              >
                <motion.span
                  animate={isInView ? { opacity: [0, 1] } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.span>
              </motion.div>
              <motion.div
                className="text-xs sm:text-sm text-foreground/60 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
