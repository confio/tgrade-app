import { Modal, Typography } from "antd";
import Button from "App/components/form/Button";
import { Field } from "App/components/form/Field";
import { PageLayout, Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { setInitialLayoutState, useLayout } from "service";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import modalBg from "./assets/modal-background.jpg";

const { Text } = Typography;

const dsoNameLabel = "DSO name";
const votingPowerLabel = "Voting power";

export default function Home(): JSX.Element {
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { showCorporateBanner: true, menuState: "hidden" }), [
    layoutDispatch,
  ]);

  const [isModalVisible, setModalVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    [getFormItemName(dsoNameLabel)]: Yup.string().required("DSO name is required"),
    [getFormItemName(votingPowerLabel)]: Yup.number().positive("Voting power must be positive"),
  });

  return (
    <PageLayout>
      <Stack gap="s4">
        <Text>WIP DSO home</Text>
        <Button onClick={() => setModalVisible(true)}>
          <div>Create DSO</div>
        </Button>
        <Modal
          centered
          footer={null}
          closable={false}
          visible={isModalVisible}
          maskStyle={{
            background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
          }}
        >
          <Formik
            initialValues={{ address: "" }}
            onSubmit={() => {
              console.log("search address");
            }}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <>
                <div onClick={() => setModalVisible(false)}>Close modal</div>
                <Form>
                  <Field label={dsoNameLabel} placeholder="Enter DSO name" />
                  <Field label={votingPowerLabel} placeholder="Enter %" units="%" />
                </Form>
              </>
            )}
          </Formik>
        </Modal>
      </Stack>
    </PageLayout>
  );
}
