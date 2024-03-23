// src/components/Board.js
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const Board = ({ columns, tasks, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex p-1 min-h-10">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.column === column.id)}
            // Passar a função onDragEnd para o componente Column
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
