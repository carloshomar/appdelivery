// src/components/Column.js
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ column, tasks }) => {
  return (
    <div
      className="flex-1 p-4 bg-gray-200 rounded-md ml-4 mr-2 shadow-lg sm:mt-4"
      style={{ backgroundColor: column.background }}
    >
      <h3 className="text-lg font-semibold mb-4 text-white ">{column.title}</h3>
      <div style={{ overflowY: "auto" }}>
        <Droppable droppableId={column.id} key={column.id}>
          {(provided) => (
            <div
              className="flex flex-col sm:h-[35vh] md:h-[35vh] lg:h-[75vh]"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
