import { motion } from "framer-motion";

export const CertificateSkeleton = ({ count = 8 }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card rounded-xl overflow-hidden p-5 space-y-4 min-h-[220px]"
      >
        {/* Award Icon Skeleton */}
        <div className="flex justify-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse mx-auto" />
        </div>

        {/* Skill Badge Skeleton */}
        <div className="flex justify-center pt-2">
          <div className="h-6 w-24 bg-gradient-to-r from-primary/30 to-slate-600 rounded-full animate-pulse" />
        </div>

        {/* Link Icon Skeleton */}
        <div className="flex justify-center pt-2">
          <div className="h-4 w-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
        </div>
      </motion.div>
    ))}
  </div>
);
