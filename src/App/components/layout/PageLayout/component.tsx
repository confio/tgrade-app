import { Typography } from "antd";
import { Center, Stack } from "App/components/layout";
import { BackButton, Burger, ErrorAlert } from "App/components/logic";
import { paths } from "App/paths";
import { Formik } from "formik";
import { Form, Select } from "formik-antd";
import * as React from "react";
import { ComponentProps, HTMLAttributes, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useWindowSize } from "utils/ui";
import { LanguageFormItem, MenuWrapper, NavHeader } from "./style";

const { Title } = Typography;
const { Option } = Select;

interface PageLayoutProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly hide?: "header" | "back-button" | "menu";
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

export default function PageLayout({
  hide,
  backButtonProps,
  children,
  ...props
}: PageLayoutProps): JSX.Element {
  const { t, i18n } = useTranslation("common");

  const { width } = useWindowSize();
  const isBigViewport = width >= 1040;

  const [isOpen, setOpen] = useState(false);

  const menuIsOpen = isBigViewport ? true : isOpen;
  const menuWidth = isBigViewport ? `300px` : "80%";
  const menuCloseIcon = isBigViewport ? false : undefined;

  return (
    <>
      {hide !== "header" && hide !== "menu" ? (
        <MenuWrapper data-background-big={isBigViewport}>
          <Menu
            isOpen={menuIsOpen}
            onClose={() => setOpen(false)}
            width={menuWidth}
            right={!isBigViewport}
            noOverlay={isBigViewport}
            noTransition={isBigViewport}
            customCrossIcon={menuCloseIcon}
          >
            <Link to={paths.account}>
              <Title level={3}>{t("menu.account")}</Title>
            </Link>
            <Link to={paths.wallet.prefix}>
              <Title level={3}>{t("menu.wallet")}</Title>
            </Link>
            <Link to={paths.cw20Wallet.prefix}>
              <Title level={3}>{t("menu.cw20Wallet")}</Title>
            </Link>
            <Link to={paths.staking.prefix}>
              <Title level={3}>{t("menu.staking")}</Title>
            </Link>
            <Link to={paths.logout}>
              <Title level={3}>{t("menu.logout")}</Title>
            </Link>
            <Formik
              initialValues={{ language: i18n.language }}
              onSubmit={({ language }) => i18n.changeLanguage(language)}
            >
              {(formikProps) => (
                <Form>
                  <LanguageFormItem name="language">
                    <Select name="language" defaultValue={i18n.language} onChange={formikProps.submitForm}>
                      <Option value="en">English</Option>
                      <Option value="es">Español</Option>
                      <Option value="ru">Русский</Option>
                    </Select>
                  </LanguageFormItem>
                </Form>
              )}
            </Formik>
          </Menu>
        </MenuWrapper>
      ) : null}
      <Center tag="main" {...props}>
        <Stack gap="s8">
          {hide !== "header" ? (
            <NavHeader>
              {hide !== "back-button" ? <BackButton {...backButtonProps} /> : null}
              {hide !== "menu" && !isBigViewport ? <Burger onClick={() => setOpen(true)} /> : null}
            </NavHeader>
          ) : null}
          <ErrorAlert />
          {children}
        </Stack>
      </Center>
    </>
  );
}
