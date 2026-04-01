import { motion } from "framer-motion";
import { PageContainer } from "../components/layout/PageContainer";

const CATEGORY_RANK = {
  frontend: 1,
  backend: 2,
  database: 3,
  ai: 4,
  tools: 5
};

const getCategoryRank = (category = "") => {
  const normalized = category.trim().toLowerCase();
  if (CATEGORY_RANK[normalized]) return CATEGORY_RANK[normalized];
  if (normalized.includes("front")) return 1;
  if (normalized.includes("back")) return 2;
  if (normalized.includes("data")) return 3;
  if (normalized.includes("ai") || normalized.includes("ml")) return 4;
  if (normalized.includes("tool")) return 5;
  return 999;
};

const groupByCategory = (skills) => {
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = {
        order: getCategoryRank(skill.category),
        skills: []
      };
    }
    const currentOrder = acc[skill.category].order;
    acc[skill.category].order = Math.min(currentOrder, getCategoryRank(skill.category));
    acc[skill.category].skills.push(skill);
    return acc;
  }, {});

  return Object.entries(grouped).sort((a, b) => {
    const orderDiff = a[1].order - b[1].order;
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a[0].localeCompare(b[0]);
  });
};

export const SkillsPage = ({ skills = [] }) => {
  const grouped = groupByCategory(skills);

  return (
    <PageContainer title="Skills" subtitle="Tech stack grouped by domain and specialization.">
      <div className="grid gap-6 md:grid-cols-2">
        {grouped.map(([category, categoryData], index) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="glass-card rounded-2xl p-5"
          >
            <h3 className="mb-4 text-lg font-semibold text-primary">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categoryData.skills
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((skill) => (
                <span
                  key={skill._id}
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-sm text-slate-100"
                >
                  {skill.icon ? `${skill.icon} ` : ""}
                  {skill.name}
                </span>
                ))}
            </div>
          </motion.section>
        ))}
      </div>
    </PageContainer>
  );
};
