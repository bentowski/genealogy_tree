import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { ChanType } from '../../types';
import Request from './Requests';
import { useAuthData } from "../../contexts/AuthProviderContext";
import {ChanPasswordDto} from "../../dtos/chan.dto";

const ModalCheckPass = (
  { chanToJoin, clef, parentCallBack }:
    { chanToJoin: ChanType | undefined, clef: number, parentCallBack: any }
): JSX.Element => {
  const [show, setShow] = useState<boolean>(false)
  const [field, setField] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const { setError } = useAuthData();

  const handleShow = (): void => {
    setShow(true);
  }

  const handleClose = (): void => {
    setShow(false)
  }

  const cancelling = (): void => {
    setAlert(false);
    setField("");
    handleClose();
  };

  const closeAlert = (): void => {
    setAlert(false);
  }

  const handlePassword = (evt: any): void => {
    evt.preventDefault();
    setField(evt.target.value);
  };

  const checkPassword = async (): Promise<void> => {
    const id: string | undefined = chanToJoin?.id; 
    let res: boolean = false;
    try {
      const pass: ChanPasswordDto = { pass: field }
        res = await Request(
        "PATCH",
        { "Content-Type": "application/json" },
        pass,
        "http://82.165.70.203:3000/chan/" + id + "/verify"
        )
    } catch (error) {
      setError(error);
    }
    if (res) {
      setAlert(false);
      setField("");
      parentCallBack(chanToJoin)
      handleClose();
      const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement
      modal.classList.add("hidden")
    }
    else {
      setAlert(true);
    }
  }

  return (
    <div className="checkPassword" id={"checkPassword" + clef}>
      <Modal show={show}>
        <div className="p-4 pb-1">
          <Modal.Header className="mb-3">
            <h2>Checking Password</h2>
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3">
              <input
                type="text"
                placeholder="password"
                maxLength={30}
                id="password"
                name="password"
                onChange={handlePassword}
                value={field}
              />
            </Form>
            <div>
              {alert ?
                <Alert
                    onClose={closeAlert}
                    variant="danger"
                    dismissible>
                  {"The password is not valid"}
                </Alert> :
                <div />
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
                className="mx-1"
                onClick={cancelling}>
              Cancel
            </Button>
            <Button
                onClick={checkPassword}
                className="mx-1">
              Validate
            </Button>
          </Modal.Footer>

        </div>
      </Modal>
      <button
        onClick={handleShow}
      >
        JOIN
      </button>
    </div>
  );
}

export default ModalCheckPass;