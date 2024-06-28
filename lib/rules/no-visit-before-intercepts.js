/**
 * @fileoverview checks that cypress intercept occurs before a visit
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks that cypress intercept occurs before a visit",
      category: 'Possible Errors'
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: 'intercepts should occur before visits.'
    }
  },

  create(context) {
    let currentBlockName = '';

    const activeCodeBlocks = []; // [{ start: { line, column}, end: { line, column } }]

    function checkActiveLoc(memberExpressionNode) {
      const locProperty = memberExpressionNode.loc

      const currentStart = locProperty.start.line;
      
      let found = false;
      activeCodeBlocks.forEach(({ start: { line: startLine }, end: { line: endLine } }) => {
        if (currentStart >= startLine && currentStart <= endLine) {
          found = true;
        }
      });
      return found;
    }

    function getBeforeEachParentCallee(callExpressionNodeCallee) {
      const p1 = callExpressionNodeCallee && callExpressionNodeCallee.parent
      const p2 = p1 && p1.parent;
      const p3 = p2 && p2.parent;
      const p4 = p3 && p3.parent;
      const p5 = p4 && p4.parent;
    
      if (p5 && p5.callee) {
        const { type, name } = p5.callee;
        if (type == 'Identifier' && (name == 'describe' || name == 'context')) {
          return p5;
        }
      }
      return null;
    }

    function recordActiveLoc(callExpressionNodeCallee) {
      const parent = getBeforeEachParentCallee(callExpressionNodeCallee);
      if (parent) {
        activeCodeBlocks.push(parent.loc);
      }
    }

    function isTestBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee;
      const found = type === 'Identifier' && name === 'it' || name  === 'test' || name == 'specify';
      if (found) {
        currentBlockName = 'TEST';
      }
      return found;
    }

    function isBeforeBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee;
      const found = type === 'Identifier' && name === 'before';
      if (found) {
        currentBlockName = 'BEFORE';
      }
      return found;
    }

    function isBeforeEachBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee;
      const found = type === 'Identifier' && name === 'beforeEach';
      if (found) {
        currentBlockName = 'BEFORE_EACH';
      }
      return found;
    }

    function isCyIntercept(memberExpressionNode) {
      const hasCy = memberExpressionNode.object && memberExpressionNode.object.name == 'cy';
      const hasIntercept = memberExpressionNode.property && memberExpressionNode.property.name == 'intercept';
      return hasCy && hasIntercept;
    }

    function isCyVisit(memberExpressionNode) {
      const hasCy = memberExpressionNode.object && memberExpressionNode.object.name == 'cy';
      const hasVisit = memberExpressionNode.property && memberExpressionNode.property.name == 'visit'
      return hasCy && hasVisit;
    }

    function checkAlias(callee) {
      if (callee && callee.property && callee.property.name == 'as') {
        return callee.object.callee;
      }
      return callee;
    }
    
    return {
      /** Depending on how AST is parsed, it is likely that beforeEach is parsed before all other it blocks */

      ExpressionStatement(node) {
        currentBlockName = ''; //reset
        
        let blockCallee;
        if (node.expression) {
          blockCallee = node.expression.callee;
        }

        if (!blockCallee) {
          return;
        }

        if (isBeforeEachBlock(blockCallee) || isTestBlock(blockCallee) || isBeforeBlock(blockCallee)) {
          const numOfArguments = node.expression.arguments.length;
          const statements = node.expression.arguments[numOfArguments - 1].body.body;

          let visitFound = false;
          if (!statements) {
            return;
          }
          statements.forEach((statement => {
            if (statement && statement.expression && statement.expression.callee) {
              const callee = checkAlias(statement.expression.callee);

              if (isCyIntercept(callee)) {
                if (visitFound || (currentBlockName == 'TEST' && checkActiveLoc(callee))) {
                  context.report({
                    node: statement,
                    messageId: 'unexpected',
                  });
                }
              }
              if (isCyVisit(callee)) {
                if (currentBlockName == 'BEFORE_EACH') {
                  recordActiveLoc(blockCallee);
                }
                visitFound = true;
              }
            }
          }));
        }
      }
    };
  },
};
