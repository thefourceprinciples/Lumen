from __future__ import annotations
import json
import os
from typing import Dict, Any
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


def build_gemini_cognizer(model_name: str = "gemini-3.8-flash"):
    """Returns a CognitiveFn compatible with LumenKernel using the google-genai SDK."""

    def cognizer(
        context_packet: Dict[str, Any], directive: RegulatorDirective
    ) -> Dict[str, Any]:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Missing GEMINI_API_KEY environment variable.")

        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt = (
            f"REGULATOR_MODE: {directive.mode}\n"
            f"REASON: {directive.reason}\n"
            f"CONTEXT_PACKET:\n{json.dumps(context_packet, indent=2)}"
        )

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

    return cognizer
