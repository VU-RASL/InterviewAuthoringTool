import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import React from "react";
import { Button, Popover } from "@material-ui/core";

const handleStyle = { left: 10 };

function TextUpdaterNode({ data, node}) {
  

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  let timeoutId = null;

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={true} />

      {data['label']}
      <div>

        <Button
        onClick={(event, node) => {
            console.log("Edit button clicked", event);
            /*setOnEdit(true);
            setOnAdd(false);
            index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));
            //setANode(props.questions[index]);
            aNode = props.questions[index];
            console.log(aNode);
            // create a function to set the value of node info to the container and call it here
            assignNode(aNode);
            console.log(onEdit);
            setIsModalOpen(true);*/
        }}
        >
        EDIT
        </Button>
        <Button
        onClick={(event) => {
            console.log("Add button clicked");
            /*setOnEdit(false);
            setOnAdd(true);
            index = props.jsonArray.nodes.length;
            console.log(index);
            assignNewNode();
            console.log(onAdd);
            setIsModalOpen(true);*/
        }}
        >
        ADD
        </Button>
        <Button
        onClick={(event) => {
            console.log("Delete button clicked");
        // index = nodes.findIndex((node) => node["id"] == anchorEl.getAttribute("data-id"));

            //DeleteNode(index);
        }}
        >
        DELETE
        </Button>

      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}

export default TextUpdaterNode;
