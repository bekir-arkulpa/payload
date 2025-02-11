/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
import queryString from "qs";
import React, { useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Where } from "../../../../types";
import flattenTopLevelFields from "../../../../utilities/flattenTopLevelFields";
import { getTranslation } from "../../../../utilities/getTranslation";
import useThrottledEffect from "../../../hooks/useThrottledEffect";
import { useSearchParams } from "../../utilities/SearchParams";
import Button from "../Button";
import Condition from "./Condition";
import fieldTypes from "./field-types";
import reducer from "./reducer";
import { Props } from "./types";
import validateWhereQuery from "./validateWhereQuery";

import { fieldHasSubFields } from "../../../../fields/config/types";
import "./index.scss";

const baseClass = "where-builder";

const mapGroupChildren = (field, i18n, childField, innerParent?) => {
  return {
    label: getTranslation(childField.label || childField.name, i18n),
    value: `${field.name}${innerParent ? `.${innerParent.name}` : ""}.${
      childField.name
    }`,
    ...fieldTypes[childField.type],
    operators: fieldTypes[childField.type]?.operators?.map((operator) => ({
      ...operator,
      label: i18n.t(`operators:${operator?.label}`),
    })),
    props: {
      ...childField,
    },
  };
};

const reduceFields = (fields, i18n) =>
  flattenTopLevelFields(fields).reduce((reduced, field) => {
    if (typeof fieldTypes[field.type] === "object") {
      let flattenedChildren = null;
      const isGroup = field.type === "group";
      if (isGroup) {
        flattenedChildren = flattenTopLevelFields(field.fields);
        if (!flattenedChildren?.length) return [...reduced];

        const mappedChildren = [];
        const deeperChildren = [];
        flattenedChildren?.forEach((f) => {
          const hasSubfields = fieldHasSubFields(f);
          if (hasSubfields) {
            const secondFlattened = flattenTopLevelFields(f.fields);
            secondFlattened.forEach((s) => {
              deeperChildren.push(
                mapGroupChildren(
                  field,
                  i18n,
                  s,
                  f.type === "array" ? f : undefined
                )
              );
            });
          } else {
            mappedChildren.push(mapGroupChildren(field, i18n, f));
          }
        });
        return [...reduced, ...mappedChildren, ...deeperChildren];
      }

      const formattedField = {
        label: getTranslation(field.label || field.name, i18n),
        value: field.name,
        ...fieldTypes[field.type],
        operators: fieldTypes[field.type].operators.map((operator) => ({
          ...operator,
          label: i18n.t(`operators:${operator.label}`),
        })),
        props: {
          ...field,
        },
      };
      return [...reduced, formattedField];
    }

    return reduced;
  }, []);

const WhereBuilder: React.FC<Props> = (props) => {
  const {
    collection,
    modifySearchQuery = true,
    handleChange,
    collection: { labels: { plural } = {} } = {},
  } = props;

  const history = useHistory();
  const params = useSearchParams();
  const { t, i18n } = useTranslation("general");

  const [conditions, dispatchConditions] = useReducer(
    reducer,
    params.where,
    (whereFromSearch) => {
      if (modifySearchQuery && validateWhereQuery(whereFromSearch)) {
        return whereFromSearch.or;
      }
      return [];
    }
  );

  const [reducedFields] = useState(() => reduceFields(collection.fields, i18n));
  useThrottledEffect(
    () => {
      const currentParams = queryString.parse(history.location.search, {
        ignoreQueryPrefix: true,
        depth: 10,
      }) as { where: Where };

      const paramsToKeep =
        typeof currentParams?.where === "object" && "or" in currentParams.where
          ? currentParams.where.or.reduce((keptParams, param) => {
              const newParam = { ...param };
              if (param.and) {
                delete newParam.and;
              }
              return [...keptParams, newParam];
            }, [])
          : [];

      const newWhereQuery = {
        ...(typeof currentParams?.where === "object"
          ? currentParams.where
          : {}),
        or: [...conditions, ...paramsToKeep],
      };

      if (handleChange) handleChange(newWhereQuery as Where);

      const hasExistingConditions =
        typeof currentParams?.where === "object" && "or" in currentParams.where;
      const hasNewWhereConditions = conditions.length > 0;

      if (
        modifySearchQuery &&
        ((hasExistingConditions && !hasNewWhereConditions) ||
          hasNewWhereConditions)
      ) {
        history.replace({
          search: queryString.stringify(
            {
              ...currentParams,
              page: 1,
              where: newWhereQuery,
            },
            { addQueryPrefix: true }
          ),
        });
      }
    },
    500,
    [conditions, modifySearchQuery, handleChange]
  );

  return (
    <div className={baseClass}>
      {conditions.length > 0 && (
        <React.Fragment>
          <div className={`${baseClass}__label`}>
            {t("filterWhere", { label: getTranslation(plural, i18n) })}
          </div>
          <ul className={`${baseClass}__or-filters`}>
            {conditions.map((or, orIndex) => (
              <li key={orIndex}>
                {orIndex !== 0 && (
                  <div className={`${baseClass}__label`}>{t("or")}</div>
                )}
                <ul className={`${baseClass}__and-filters`}>
                  {Array.isArray(or?.and) &&
                    or.and.map((_, andIndex) => (
                      <li key={andIndex}>
                        {andIndex !== 0 && (
                          <div className={`${baseClass}__label`}>
                            {t("and")}
                          </div>
                        )}
                        <Condition
                          value={conditions[orIndex].and[andIndex]}
                          orIndex={orIndex}
                          andIndex={andIndex}
                          key={andIndex}
                          fields={reducedFields}
                          dispatch={dispatchConditions}
                        />
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
          <Button
            className={`${baseClass}__add-or`}
            icon="plus"
            buttonStyle="icon-label"
            iconPosition="left"
            iconStyle="with-border"
            onClick={() => {
              if (reducedFields.length > 0) {
                dispatchConditions({
                  type: "add",
                  field: reducedFields[0].value,
                });
              }
            }}
          >
            {t("or")}
          </Button>
        </React.Fragment>
      )}
      {conditions.length === 0 && (
        <div className={`${baseClass}__no-filters`}>
          <div className={`${baseClass}__label`}>{t("noFiltersSet")}</div>
          <Button
            className={`${baseClass}__add-first-filter`}
            icon="plus"
            buttonStyle="icon-label"
            iconPosition="left"
            iconStyle="with-border"
            onClick={() => {
              if (reducedFields.length > 0) {
                dispatchConditions({
                  type: "add",
                  field: reducedFields[0].value,
                });
              }
            }}
          >
            {t("addFilter")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhereBuilder;
