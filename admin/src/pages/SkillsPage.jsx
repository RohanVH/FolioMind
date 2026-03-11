import { useEffect, useMemo, useState } from "react";
import { createSkill, deleteSkill, getSkills, updateSkill } from "../api/adminApi";

const DEFAULT_CATEGORY_ORDER = {
  frontend: 1,
  backend: 2,
  database: 3,
  ai: 4,
  tools: 5
};

const getDefaultCategoryOrder = (category) => {
  const normalized = (category || "").trim().toLowerCase();
  if (!normalized) {
    return 999;
  }
  if (DEFAULT_CATEGORY_ORDER[normalized]) {
    return DEFAULT_CATEGORY_ORDER[normalized];
  }
  if (normalized.includes("front")) return 1;
  if (normalized.includes("back")) return 2;
  if (normalized.includes("data")) return 3;
  if (normalized.includes("ai") || normalized.includes("ml")) return 4;
  if (normalized.includes("tool")) return 5;
  return 999;
};

const defaultForm = {
  name: "",
  category: "",
  icon: "",
  order: 0
};

export const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");
  const [categories, setCategories] = useState([]);
  const [dragSkill, setDragSkill] = useState({ category: "", index: -1 });
  const [savingSkillOrder, setSavingSkillOrder] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const orderedCategories = useMemo(() => {
    const map = new Map();
    skills.forEach((skill) => {
      const category = (skill.category || "").trim();
      if (!category) {
        return;
      }
      const order = getDefaultCategoryOrder(category);
      if (!map.has(category) || order < map.get(category)) {
        map.set(category, order);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([category]) => category);
  }, [skills]);

  const load = async () => {
    const data = await getSkills();
    setSkills(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setCategories(orderedCategories);
  }, [orderedCategories]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      categoryOrder: getDefaultCategoryOrder(form.category),
      order: Number(form.order) || 0
    };
    if (editingId) {
      await updateSkill(editingId, payload);
    } else {
      await createSkill(payload);
    }
    setForm(defaultForm);
    setEditingId("");
    await load();
  };

  const edit = (skill) => {
    setEditingId(skill._id);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
      order: skill.order || 0
    });
  };

  const remove = async (id) => {
    await deleteSkill(id);
    await load();
  };

  const getCategorySkills = (category, sourceSkills = skills) =>
    sourceSkills
      .filter((skill) => skill.category === category)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));

  const reorderSkillsInCategory = (category, from, to) => {
    if (from < 0 || to < 0 || from === to) {
      return;
    }

    const categorySkills = getCategorySkills(category);
    if (!categorySkills.length) {
      return;
    }

    const updatedCategorySkills = [...categorySkills];
    const [moved] = updatedCategorySkills.splice(from, 1);
    updatedCategorySkills.splice(to, 0, moved);

    const orderMap = new Map();
    updatedCategorySkills.forEach((skill, index) => {
      orderMap.set(skill._id, index + 1);
    });

    setSkills((prev) =>
      prev.map((skill) =>
        skill.category === category
          ? {
              ...skill,
              order: orderMap.get(skill._id) ?? skill.order
            }
          : skill
      )
    );
  };

  const saveSkillOrder = async () => {
    setSavingSkillOrder(true);
    setStatusMessage("");
    try {
      await Promise.all(
        skills.map((skill) =>
          updateSkill(skill._id, {
            categoryOrder: getDefaultCategoryOrder(skill.category),
            order: Number(skill.order) || 0
          })
        )
      );
      await load();
      setStatusMessage("Skill order saved.");
    } catch (error) {
      setStatusMessage("Failed to save skill order.");
    } finally {
      setSavingSkillOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Skills Management</h2>
      <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950 p-4 md:grid-cols-4">
        <input
          placeholder="Skill name"
          value={form.name}
          required
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          placeholder="Category"
          value={form.category}
          required
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          placeholder="Icon (emoji or text)"
          value={form.icon}
          onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <input
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2"
        />
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 font-medium text-slate-950 md:col-span-2">
          {editingId ? "Update Skill" : "Add Skill"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId("");
              setForm(defaultForm);
            }}
            className="rounded-lg border border-white/15 px-4 py-2 md:col-span-2"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Skill Order (Drag within Category)
          </h3>
          <button
            type="button"
            onClick={saveSkillOrder}
            disabled={savingSkillOrder || skills.length === 0}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {savingSkillOrder ? "Saving..." : "Save Skill Order"}
          </button>
        </div>
        <div className="space-y-4">
          {categories.map((category) => {
            const categorySkills = getCategorySkills(category);
            if (!categorySkills.length) {
              return null;
            }
            return (
              <div key={category} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="mb-2 text-sm font-semibold text-primary">{category}</p>
                <div className="space-y-2">
                  {categorySkills.map((skill, index) => (
                    <div
                      key={skill._id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        setDragSkill({ category, index });
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (dragSkill.category !== category || dragSkill.index === -1 || dragSkill.index === index) {
                          return;
                        }
                        reorderSkillsInCategory(category, dragSkill.index, index);
                        setDragSkill({ category, index });
                      }}
                      onDrop={() => {
                        if (dragSkill.category !== category) {
                          setDragSkill({ category: "", index: -1 });
                          return;
                        }
                        setDragSkill({ category: "", index: -1 });
                      }}
                      onDragEnd={() => setDragSkill({ category: "", index: -1 })}
                      className="flex cursor-move items-center justify-between rounded-lg border border-white/15 bg-slate-950 p-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {skill.icon} {skill.name}
                        </p>
                        <p className="text-sm text-slate-400">Order: {skill.order ?? 0}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => edit(skill)}
                          className="rounded-lg border border-white/15 px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(skill._id)}
                          className="rounded-lg border border-red-400/50 px-3 py-1 text-sm text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {categories.length === 0 && <p className="text-sm text-slate-400">No skills found yet.</p>}
        </div>
      </div>
      {statusMessage && <p className="text-sm text-slate-300">{statusMessage}</p>}

      <div className="space-y-3">
        {skills.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">No skills added yet.</p>
          </div>
        )}
        {skills.map((skill) => (
          <div
            key={`summary-${skill._id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 p-4"
          >
            <div>
              <p className="font-semibold">
                {skill.icon} {skill.name}
              </p>
              <p className="text-sm text-slate-400">{skill.category} (skill order: {skill.order ?? 0})</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => edit(skill)}
                className="rounded-lg border border-white/15 px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(skill._id)}
                className="rounded-lg border border-red-400/50 px-3 py-1 text-sm text-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
