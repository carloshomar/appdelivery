import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const Board = ({ columns, tasks, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={"flex flex-col sm:flex-row md:flex-row lg:flex-row p-1"}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.column === column.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
