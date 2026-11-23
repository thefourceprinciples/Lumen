from __future__ import annotations
import json
import os
import time
from typing import Dict, Any, Sequence
from core.regulator import RegulatorDirective


SYSTEM_DIRECTIVE = """You are Lumen, a homeostatic autonomous agent governed by the Fource regulator.
Respond ONLY with valid JSON containing these exact keys:
- "status": "OK"
- "summary": concise description of reasoning or action taken
- "invariants_added": list of verified facts or rules learned (strings)
- "corrections": list of errors resolved or falsified (strings)
- "artifacts_modified": list of files or records updated (strings)
- "return_path": next deterministic trigger or state ("IDLE", "VERIFY", "COMPRESS", or "CONTINUE")
"""

DEFAULT_MODEL_CHAIN = (
    "gemini-3.8-flash",
    "gemini-3.8-flash-lite",
    "gemini-3.5-flash",
)


def build_gemini_cognizer(model_chain: Sequence[str] = DEFAULT_MODEL_CHAIN):
    """Returns a resilient CognitiveFn with automatic fallback across Gemini models."""

    def cognizer(
        context_packet: Dict[str, Any], directive: RegulatorDirective
    ) -> Dict[str, Any]:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Missing GEMINI_API_KEY environment variable.")

        from google import genai
        from google.genai import types
        from google.genai import errors

        client = genai.Client(api_key=api_key)
        prompt = (
            f"REGULATOR_MODE: {directive.mode}\n"
            f"REASON: {directive.reason}\n"
            f"CONTEXT_PACKET:\n{json.dumps(context_packet, indent=2)}"
        )

        last_err: Exception | None = None
        for idx, model_name in enumerate(model_chain):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_DIRECTIVE,
                        temperature=directive.temperature,
                        max_output_tokens=directive.max_output_tokens,
                        response_mime_type="application/json",
                    ),
                )
                return json.loads(response.text)
            except (errors.ServerError, errors.ClientError) as exc:
                last_err = exc
                time.sleep(2 ** idx)
                continue

        raise RuntimeError(f"All models in fallback chain failed: {last_err}")

    return cognizer
