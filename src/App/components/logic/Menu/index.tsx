import { Typography } from "antd";
import { paths } from "App/paths";
import { Formik } from "formik";
import { Form, Select } from "formik-antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import { slide as BurgerMenu } from "react-burger-menu";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageFormItem, MenuWrapper } from "./style";

const { Title } = Typography;
const { Option } = Select;

interface MenuProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly isBigViewport: boolean;
  readonly isOpen: boolean;
  readonly closeMenu: () => void;
}

export default function Menu({ isBigViewport, isOpen, closeMenu, ...restProps }: MenuProps): JSX.Element {
  const { t, i18n } = useTranslation("common");

  const menuIsOpen = isBigViewport ? true : isOpen;
  const menuWidth = isBigViewport ? `300px` : "80%";
  const menuCloseIcon = isBigViewport ? false : undefined;

  return (
    <MenuWrapper data-background-big={isBigViewport} {...restProps}>
      <BurgerMenu
        isOpen={menuIsOpen}
        onClose={closeMenu}
        width={menuWidth}
        right={!isBigViewport}
        noOverlay={isBigViewport}
        noTransition={isBigViewport}
        customCrossIcon={menuCloseIcon}
      >
        <Link to={paths.account.prefix} onClick={closeMenu}>
          <Title level={3}>{t("menu.account")}</Title>
        </Link>
        <Link to={paths.dso.prefix} onClick={closeMenu}>
          <Title level={3}>DSO</Title>
        </Link>
        <Link to={paths.logout} onClick={closeMenu}>
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
      </BurgerMenu>
    </MenuWrapper>
  );
}
