"use client";

import { motion } from "framer-motion";
import { TaskCard } from "./task-card";
import { Task } from "@/lib/types";

interface AnimatedTaskListProps {
  tasks: Task[];
}

export function AnimatedTaskList({ tasks }: AnimatedTaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <TaskCard task={task} />
        </motion.div>
      ))}
    </div>
  );
}
